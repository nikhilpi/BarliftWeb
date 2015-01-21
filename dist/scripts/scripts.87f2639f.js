"use strict";angular.module("barliftApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/admin",{templateUrl:"views/admin.html",controller:"AdminCtrl"}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$location","User",function(a,b,c){Parse.initialize("5DZi1FrdZcwBKXIxMplWsqYu3cEEumlmFDB1kKnC","G7yhVdBRY3S2jvjkHKddlsES5YZu1z99Nh9JPLTN"),c.getUser(),a.$on("$routeChangeStart",function(c,d){null===a.loggedInUser&&("views/admin.html"===d.templateUrl||b.path("/login"))})}]),angular.module("barliftApp").controller("MainCtrl",["$scope","ParseService",function(a,b){a.user={email:null,barName:null,isBar:!1},a.addEmail=function(c){"undefined"==typeof a.user.email?a.user.email="Invalid Email!":(a.user.isBar="isBar"===c?!0:!1,b.addEmail(a.user.email,a.user.isBar,a.user.barName,function(){a.$apply(function(){a.user.email="Thanks!"})}))}}]),angular.module("barliftApp").controller("HeaderCtrl",["$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("barliftApp").factory("ParseService",["$rootScope",function(a){Parse.initialize("5DZi1FrdZcwBKXIxMplWsqYu3cEEumlmFDB1kKnC","G7yhVdBRY3S2jvjkHKddlsES5YZu1z99Nh9JPLTN"),a.loggedInUser;var b=Parse.Object.extend("email"),c={name:"Parse",login:function(b,c,d){Parse.User.logIn(b,c,{success:function(b){a.loggedInUser=b,d(b)},error:function(a,b){alert("Error: "+b.message)}})},logout:function(){Parse.User.logOut(),a.loggedInUser=null},getEmails:function(a){var c=new Parse.Query(b);c.find({success:function(b){a(b)},error:function(a){alert("Error: "+a.message)}})},addEmail:function(a,c,d,e){var f=new b;f.save({email:a,name:d,isBar:c},{success:function(a){e(a)},error:function(a){alert("Error: "+a.message)}})},getUser:function(){return a.loggedInUser?a.loggedInUser:void 0},isLoggedIn:function(){return a.loggedInUser?!0:!1}};return c}]),angular.module("barliftApp").controller("LoginCtrl",["$scope","$location","User",function(a,b,c){c.isLoggedIn()&&b.path("/admin"),a.login=function(){c.login(a.login_username,a.login_password,function(){a.$apply(function(){b.path("/admin")})})}}]),angular.module("barliftApp").controller("AdminCtrl",["$scope","$location","User","ParseService",function(a,b,c,d){c.isLoggedIn()||b.path("/login"),a.emails=[],d.getEmails(function(b){a.$apply(function(){a.emails=b})}),a.logout=function(){c.logout(),b.path("/login")}}]),angular.module("barliftApp").directive("emailGrid",function(){return{templateUrl:"views/emailgrid.html",restrict:"E",link:function(){}}}),angular.module("barliftApp").directive("scrollOnClick",function(){return{restrict:"A",link:function(a,b,c){var d=c.href;b.on("click",function(){var a;a=d?$(d):b,$("body").animate({scrollTop:a.offset().top},"slow")})}}}),angular.module("barliftApp").factory("User",function(){var a,b={name:"User",login:function(b,c,d){Parse.User.logIn(b,c,{success:function(b){a=b,d(b)},error:function(a,b){alert("Error: "+b.message)}})},logout:function(){Parse.User.logOut(),a=null},getUser:function(){return a||Parse.User.current()?(a=Parse.User.current(),Parse.User.current()):void 0},isLoggedIn:function(){return a||Parse.User.current()?!0:!1}};return b});