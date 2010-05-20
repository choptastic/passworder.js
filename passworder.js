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

function td(body,colspan=1)
{
	return "<td colspan=" + colspan + ">" + body + "</td>";
}

function input(id,onchange,def)
{
	if(typeof def=="undefined")
		def = "";
	return "<input type=text value=\"" + def + "\" id=\"" + id + "\" onchange=\"" + onchange + "\" />";
}

function checkbox(id,onchange)
{
	return "<input type=checkbox id=" + id + " onchange=\"" + onchange + "\" />";
}



function print_form()
{
	fun = "passworder_calc_pass()";
	w(table(
		tr(
			td("<b>passworder.js</b> - Password Generator<br /><a href='http://github.com/choptastic/passworder' target=_new>http://github.com/choptastic/passworder</a>")
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
			td("<span id=\"final_pw\" style='font-size:larger;font-weight:bold;font-family:monospace'></span>")
		)
	));

}

print_form();
