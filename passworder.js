/* passworder.js - salted password generator
 * The MIT License
 *
 * Copyright (c) 2010 Jesse Gumm and Sigma Star Systems, LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE. */

function dge(e)
{
	return document.getElementById(e);
}

function w(m)
{
	document.write(m);
}

function label(fieldname,description)
{
	return fieldname + "<br /><i style='font-size:smaller;color:grey'>" + description + "</i>";
}

function table(body)
{
	return "<table>" + body + "</table>";
}

function tr(body)
{
	return "<tr>" + body + "</tr";
}

function td(body,colspan)
{
	if(typeof colspan=="undefined")
		colspan=1;
	return "<td colspan=" + colspan + ">" + body + "</td>";
}

function input(id,onchange,def)
{
	if(typeof def=="undefined")
		def = "";
	return "<input type=text value=\"" + def + "\" id=\"" + id + "\" onkeyup=\"" + onchange + "\" />";
}

function checkbox(id,onchange)
{
	return "<input type=checkbox id=" + id + " onclick=\"" + onchange + "\" />";
}

function clear_history()
{
	dge("history").innerHTML = "";
}

function add_history(v)
{
	dge("history").innerHTML += v + "<br />";
}

function calculate_pass(interleaved,base,length,attemptsleft)
{
	if(typeof attemptsleft == "undefined")
		attemptsleft = 10;

	if(attemptsleft==10)
		clear_history();

	if(isNaN(length))
		return "";
	else
		length = parseInt(length);

	if(length<1)
		return "";


	//alert(length);
	
	var numberized = convert_to_number(interleaved);
	var result = to_base(base,numberized);

	add_history(numberized + ": " + result);

	if(interleaved == "")
		return "";
	else if(result.length == 0)
		return "Something Went Wrong";
	else if(result.length < length)
	{
		//alert("Too short:" + result + "attemptsleft: " + attemptsleft);
		return calculate_pass(interleaved + interleaved,base,length,attemptsleft-1);
	}
	else if(result.length > length)
	{
		//alert("Too long:" + result + "attmptsleft: " + attemptsleft);
		if(attemptsleft > 0)
			return calculate_pass(combine_every_other(interleaved),base,length,attemptsleft-1);
		else
			return result.substr(0,length);
	}
	else
		return result;
}
		
function combine_every_other(s)
{
	var retstr = "";
	if(s.length<=1)
	{
		return String.fromCharCode(s.charCodeAt(0)/2);
	}
	for(i=0;i<s.length;i+=2)
	{
		var num = (s.charCodeAt(i) + s.charCodeAt(i+1))%256;
		retstr += String.fromCharCode(num);
	}
	return retstr;
}




function passworder_calc_pass()
{
	var salt = dge("salt").value;
	var password = dge("password").value;
	var length = parseInt(dge("length").value);
	var specialchars = dge("specialchars").checked;
	var base = specialchars ? 78 : 62; //62 = alphanumeric only, 78 = add special chars

	
	var interleaved = interleave_salt_and_pw(salt,password);
	var finalpw = calculate_pass(interleaved,base,length);

	dge("finalpw").innerHTML = finalpw;
}

/*function cut_to_length(str,len)
{
	if(str.length > len)
*/	

function interleave_salt_and_pw(salt,pw)
{
	var retstr = "";
	var max = Math.max(salt.length,pw.length);
	for(var i=0;i<max;i++)
		retstr += ith_char(i,salt) + ith_char(i,pw);
	return retstr;
}

function ith_char(i,str)
{
	if(i>=str.length)
		i %= str.length;
	return str.charAt(i);
}


function convert_to_number(s)
{
	var num=0;
	for(var i=0;i<s.length;i++)
		num += s.charCodeAt(i) * Math.pow(256,i);
	return num;	
}

function log_base(base,num)
{
	return Math.log(num)/Math.log(base);
}

// b is the base, in our case, either 62 for alphanumeric only or 78 for non-alphanumeric only
function to_base(base,num)
{
	var retstr = "";
	var curval = 0;
	var log = Math.floor(log_base(base,num));
	while(log>=0)
	{
		var mult = Math.pow(base,log);
		curval = Math.floor(num/mult);
		retstr += onechar(curval);
		num -= curval*mult;
		log--;
	}
	return retstr;
}



function onechar(num)
{
	if(num>=0 && num<=9)
		return "" + num; // 0-9
	else{
		num -= 10;
		if(num>=0 && num<=25)
			return String.fromCharCode(num + 65); // A-Z
		else {
			num -= 26;
			if(num>=0 && num<=25)
				return String.fromCharCode(num+97); // a-z
			else {
				num -= 26;
				switch(num)
				{
					case 0: return "-";
					case 1: return "+";
					case 2: return "=";
					case 3: return "_";
					case 4: return "?";
					case 5: return ".";
					case 6: return ",";
					case 7: return ";";
					case 8: return ":";
					case 9: return "@";
					case 10: return "$";
					case 11: return "%";
					case 12: return "!";
					case 13: return "~";
					case 14: return "*";
					case 15: return "^";
					default: alert("out of range");return ;
				}
			}
		}
	}
}





function print_form()
{
	fun = "passworder_calc_pass()";
	w(table(
		tr(
			td("<b>passworder.js</b> - Password Generator<br /><a href='http://github.com/choptastic/passworder.js' target=_new>http://github.com/choptastic/passworder.js</a>",2)
		) +
		tr(
			td(label("Salt:","A word, phrase, or other string of charcters that you can easily remember.  This will be the, in a sense, 'the password to your passwords'")) +
			td(input("salt",fun))
		) +
		tr(
			td(label("Password:","This is the actual password you wish to use.  This would be a variable thing.  Should only use this password in one place, to be safe.")) +
			td(input("password",fun))
		) +
		tr(
			td(label("Desired Password Length:","In number of characters")) +
			td(input("length",fun,10))
		) +
		tr(
			td(label("Allow non-alphanumeric characters in the password?","Such as +, ?, ;, :, =, etc..</i>")) +
			td(checkbox("specialchars",fun))
		) +
		tr(
			td(label("Generated Password:","This is the final password to enter into password fields on webpages and programs.")) +
			td("<span id=\"finalpw\" style='font-size:larger;font-weight:bold;font-family:monospace'></span>")
		)
		+ tr(
			td(label("Result History:","Can be ignored")) +
			td("<span id='history' style='font-family:monospace'></span>")
		)
	));

}

print_form();
