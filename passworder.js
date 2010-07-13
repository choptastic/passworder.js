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

var passworder = {
	version: "0.2",
	trainer_correct: 0,
	max_attempts: 40,
	dge : function(e)
	{
		return document.getElementById(e);
	},
	w: function(m)
	{
		document.write(m);
	},

	label: function(fieldname,description)
	{
		return fieldname + "<br /><i style='font-size:smaller;color:grey'>" + description + "</i>";
	},

	table: function(body)
	{
		return "<table>" + body + "</table>";
	},

	tr: function(body)
	{
		return "<tr>" + body + "</tr>";
	},

	td: function(body,colspan)
	{
		if(typeof colspan=="undefined")
			colspan=1;
		return "<td colspan=" + colspan + ">" + body + "</td>";
	},
	link: function(id,text,url)
	{
		return "<a href=\"" + url + "\" id=\"" + id + "\">" + text + "</a>";
	},
	input: function(id,onchange,def)
	{
		if(typeof def=="undefined")
			def = "";
		return "<input type=text value=\"" + def + "\" id=\"" + id + "\" onkeyup=\"" + onchange + "\" />";
	},
	checkbox: function(id,onchange)
	{
		return "<input type=checkbox id=" + id + " onclick=\"" + onchange + "\" />";
	},

	clear_history: function()
	{
		if(this.dge("history"))
			this.dge("history").innerHTML = "";
	},
	add_history: function(v)
	{
		if(this.dge("history"))
			this.dge("history").innerHTML += v + "<br />";
	},

	calculate_pass: function(numberized,base,length,attemptsleft)
	{
		this.add_history("----------------------------------");
		if(typeof attemptsleft == "undefined")
			attemptsleft = length*2;

		if(length>49)
			return "Please keep password length under 50";

		if(isNaN(length))
			return "";
		else
			length = parseInt(length);

		if(length<1)
			return "";

		var result = this.to_base(base,numberized);

		this.add_history("Pass " + attemptsleft + " - " + numberized + " --> " + result);

		if(numberized==0)
			return "Nothing Yet";
		else if(result.length == 0)
			return "Something Went Wrong";
		else if(result.length < length)
		{
			this.add_history("Too short:" + result.length + " < " + length);
			return this.calculate_pass(numberized*(attemptsleft+1),base,length,attemptsleft);
		}
		else if(result.length > length)
		{
			this.add_history("Too Long:" + result.length + " > " + length);
			if(attemptsleft > 0)
				return this.calculate_pass(Math.floor(Math.sqrt(numberized)),base,length,attemptsleft-1);
			else
				return result.substr(0,length);
		}
		else
			return result;
	},
	passworder_calc_pass: function()
	{
		var salt = this.dge("salt").value;
		var password = this.dge("password").value;
		var length = parseInt(this.dge("length").value);
		var specialchars = this.dge("specialchars").checked;
		var base = specialchars ? 78 : 62; //62 = alphanumeric only, 78 = add special chars

		
		this.clear_history();

		var interleaved = this.interleave_salt_and_pw(salt,password);
		
		this.add_history("Interleaved: " + interleaved);
		var numberized = this.convert_to_number(interleaved);
		var finalpw = this.calculate_pass(numberized,base,length);

		this.dge("finalpw").innerHTML = finalpw;
	},

	interleave_salt_and_pw: function(salt,pw)
	{
		var retstr = "";
		var max = Math.max(salt.length,pw.length);


		var i;
		for(i=0;i<max;i++)
			retstr += this.ith_char(i,salt) + this.ith_char(i,pw);
		return retstr;
	},

	ith_char: function(i,str)
	{
		var timespast = 0;
		if(i>=str.length)
		{
			timespast = Math.floor(i/str.length);
			i %= str.length;
		}
		return String.fromCharCode((str.charCodeAt(i)+timespast - 32)%224 + 32);
	},

	convert_to_number: function(s)
	{
		var num=0;
		for(var i=0;i<s.length;i++)
			num += s.charCodeAt(i) * Math.pow(256,i);
		return num;	
	},
	
	log_base: function(base,num)
	{
		return Math.log(num)/Math.log(base);
	},

	// b is the base, in our case, either 62 for alphanumeric only or 78 for non-alphanumeric only
	to_base: function(base,num)
	{
		var retstr = "";
		var curval = 0;
		var log = Math.floor(this.log_base(base,num));
		while(log>=0)
		{
			var mult = Math.pow(base,log);
			curval = Math.floor(num/mult);
			retstr += this.onechar(curval);
			num -= curval*mult;
			log--;
		}
		return retstr;
	},
	onechar: function(num)
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
	},
	reset_train_count: function()
	{
		this.trainer_correct = 0;
		this.dge("pw_left").innerHTML = this.max_attempts;
	},
	train_verify: function(pw)
	{
		real_password = this.dge("finalpw").innerHTML;
		if(real_password==pw)
		{
			this.trainer_correct++;
			this.dge("pw_left").innerHTML = this.max_attempts - this.trainer_correct;
			if(this.trainer_correct == this.max_attempts)
			{
				alert("Congratulations! You now know the new password");
				this.reset_train_count();
			}
			this.dge("train_input").value="";
		}
	},
	start_training: function()
	{
		this.dge("pw_trainer").innerHTML = "Enter the password above. As soon as you have the<br />correct password, it'll clear and you'll enter it again.<br />" +
						this.input("train_input","passworder.train_verify(this.value)") +
						"<br />Times Left: <span id=pw_left>" + this.max_attempts + "</span>";
						
	},
	print_form: function()
	{
		fun = "passworder.passworder_calc_pass()";
		this.w(this.table(
			this.tr(
				this.td("<div class=pw_title style='text-align:center'><b>passworder.js</b> (v" + this.version + ") - Password Generator<br /><a href='http://github.com/choptastic/passworder.js' target=_new>http://github.com/choptastic/passworder.js</a></div>",2)
			) +
			this.tr(
				this.td(this.label("Salt:","A word, phrase, or other string of charcters that you can easily remember. <br />This will be the, in a sense, \"the password to your passwords\"")) +
				this.td(this.input("salt",fun))
			) +
			this.tr(
				this.td(this.label("Password:","This is the actual password you wish to use.  You should only<br />use this password in one place, to be safe.")) +
				this.td(this.input("password",fun))
			) +
			this.tr(
				this.td(this.label("Desired Password Length:","In number of characters")) +
				this.td(this.input("length",fun,10))
			) +
			this.tr(
				this.td(this.label("Allow non-alphanumeric characters in the password?","Such as +, ?, ;, :, =, etc..</i>")) +
				this.td(this.checkbox("specialchars",fun))
			) +
			this.tr(
				this.td("<div class=pw_result style='text-align:center'>Generated Password:<br /><span id=\"finalpw\" style='font-size:24pt;font-weight:bold;font-family:monospace'>Nothing Yet</span>",2)
			) +
			this.tr(
				this.td("<div style='text-align:center'>" + this.link("pw_trainer_link","Train this password","javascript:passworder.start_training()") + "<div id=pw_trainer></div></div>")
			)
			/*
			+ this.tr(
				this.td(this.label("Result History:","Can be ignored")) +
				this.td("<div id='history' style='height:200px;overflow:auto;font-family:monospace'></span>")
			)
			//*/
		));

	}
}

passworder.print_form();
