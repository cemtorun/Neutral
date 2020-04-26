"use strict";
var auth_url_base = "neutral-dev.tk:1337"
var auth_url_register = auth_url_base + "/auth/local/register";
var auth_url_login = auth_url_base + "/auth/local";

async function jsonAPICall(endpoint, content) {
	return await new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", auth_url_login, true);
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				var response = JSON.parse(xhr.responseText);
				if(xhr.status == 200) {
					resolve(response);
				} else {
					reject(response);
				}
			}
		}
		xhr.sendRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(JSON.stringify(content));
	});
}

async function userLogin(identifier, password) {
	var ret = await jsonAPICall(auth_url_login, {
		identifier: identifier,
		password: password
	});
	delete ret.user.purchases;
	chrome.storage.local.set({"login": ret});
	return ret;
}

function userLogout() {
	chrome.storage.local.remove(["login"]);
}

function userRegister(username, email, password) {
	var ret = await jsonAPICall(auth_url_register, {
		username: username,
		email: email,
		password: password
	});
	delete ret.user.purchases;
	chrome.storage.local.set({"login": ret});
	return ret;
}

async function getUser() {
	return await new Promise(function(resolve, reject) {
		chrome.storage.local.get(["login"], function(res) {
			resolve(res.jwt);
		});
	});
}

async function isLoggedIn() {
	return !!(await getUser());
}

