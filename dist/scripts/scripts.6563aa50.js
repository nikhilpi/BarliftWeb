"use strict";angular.module("barliftApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","angulartics","angulartics.google.analytics"]).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"Admin",editor:"User",bar:"Bar"}).config(["$routeProvider","USER_ROLES",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",data:{authorizedRoles:[b.all]}}).when("/about",{templateUrl:"views/main.html",controller:"MainCtrl",data:{authorizedRoles:[b.all]}}).when("/team",{templateUrl:"views/main.html",controller:"MainCtrl",data:{authorizedRoles:[b.all]}}).when("/competition",{templateUrl:"views/main.html",controller:"MainCtrl",data:{authorizedRoles:[b.all]}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",data:{authorizedRoles:[b.all]}}).when("/admin",{templateUrl:"views/admin.html",controller:"AdminCtrl",data:{authorizedRoles:[b.admin]}}).when("/bar",{templateUrl:"views/bar.html",controller:"BarCtrl",data:{authorizedRoles:[b.bar]}}).otherwise({redirectTo:"/"})}]).run(["$rootScope","$http","$location","$window","USER_ROLES","AUTH_EVENTS","AuthService","Session",function(a,b,c,d,e,f,g,h){if(b.defaults.headers.common["X-Parse-Application-Id"]="5DZi1FrdZcwBKXIxMplWsqYu3cEEumlmFDB1kKnC",b.defaults.headers.common["X-Parse-REST-API-Key"]="pMT9AefpMkJfbcJ5fTA2uOGxwpitMII7hpCt8x4O",d.sessionStorage.session){var i=JSON.parse(d.sessionStorage.session);h.create(i.userId,i.userName,i.sessionToken,i.userRole)}a.$on("$routeChangeStart",function(b,d){var e=d.data.authorizedRoles;g.isAuthorized(e)||(b.preventDefault(),g.isAuthenticated()?(a.$broadcast(f.notAuthorized),c.path("/login")):(a.$broadcast(f.notAuthenticated),c.path("/login")))})}]).config(["$httpProvider",function(a){a.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]).factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]),angular.module("barliftApp").controller("MainCtrl",["$scope","Emails","$location","$window","$http",function(a,b,c,d,e){a.pagename=function(){return a.selection?(c.path("/"+a.selection),"/"+a.selection):c.path()},a.getDevice=function(){var a=d.navigator.userAgent,b={android:/Android/i,ios:/iPhone/i};for(var c in b)if(b[c].test(a))return c;return"unknown"},a.isActive=function(a){return a===c.path()},a.switchWithin=function(b){a.selection=b},a.results=null,e.post("https://api.parse.com/1/functions/getScores").success(function(b){for(var c=[],d=0;d<Object.keys(b.result).length;d++){var e=Object.keys(b.result)[d],f=b.result[e];""!==e&&"undefined"!==e&&"Choose a team..."!==e&&c.push({name:e,score:f})}a.results=c}),a.user={email:null},a.addEmail=function(){"undefined"==typeof a.user.email?a.user.email="Invalid Email!":b.save({email:a.user.email},function(){a.user.email="Thanks!"})}}]),angular.module("barliftApp").controller("HeaderCtrl",["$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("barliftApp").controller("LoginCtrl",["$rootScope","$timeout","$scope","$location","User","AuthService","AUTH_EVENTS","Session",function(a,b,c,d,e,f,g,h){c.credentials={username:"",password:""},f.isAuthenticated()&&d.path("/"+h.userRole.toLowerCase()),c.login=function(b){f.login(b).then(function(){a.$broadcast(g.loginSuccess),d.path("/"+h.userRole.toLowerCase())},function(){a.$broadcast(g.loginFailed)})}}]);var app=angular.module("barliftApp");app.controller("AdminCtrl",["$scope","Deals","AuthService",function(a,b,c){a.deals=[],b.query(function(b){a.deals=b}),a.logout=c.logout}]),angular.module("barliftApp").directive("scrollOnClick",function(){return{restrict:"A",link:function(a,b,c){var d=c.href;b.on("click",function(){var a;a=d?$(d):b,$("body").animate({scrollTop:a.offset().top},"slow")})}}}),angular.module("barliftApp").directive("navBar",function(){return{templateUrl:"views/navbar.html",restrict:"E",link:function(){}}}),angular.module("barliftApp").factory("User",["$resource","$http","ParseTypes","Session",function(a,b,c){var d=a("https://api.parse.com/1/users/:objectId",{objectId:"@objectId"},{getCurrent:{method:"GET",cache:!0,url:"https://api.parse.com/1/users/me",transformResponse:function(a){a=angular.fromJson(a);var b=c.resProcess(a,"_User");return b}},get:{method:"GET",cache:!0,transformResponse:function(a){return a=angular.fromJson(a),c.resProcess(a,"_User")}},save:{method:"POST",transformRequest:function(a){var b=c.reqProcess(a);return b=angular.toJson(b)},transformResponse:function(a){return a=angular.fromJson(a),c.resProcess(a,"_User")}},query:{method:"GET",isArray:!0,transformResponse:function(a){a=angular.fromJson(a);var b=a.results,d=b.map(function(a){return c.resProcess(a,"_User")});return d}},update:{method:"PUT",transformRequest:function(a){var b=c.reqProcess(a);return b=angular.toJson(b)},transformResponse:function(a){return a=angular.fromJson(a),c.resProcess(a,"_User")}}});return d}]),angular.module("barliftApp").factory("Deals",["$resource","ParseTypes","Session",function(a,b,c){var d=a("https://api.parse.com/1/classes/Deal/:objectId",{objectId:"@objectId"},{save:{method:"POST",transformRequest:function(a){var c=b.reqProcess(a);return c=angular.toJson(c)}},query:{isArray:!0,transformResponse:function(a){a=angular.fromJson(a);var c=a.results,d=c.map(function(a){return b.resProcess(a,"Deal")});return d}},update:{method:"PUT",transformRequest:function(a){var c=b.reqProcess(a);return c=angular.toJson(c)}},"delete":{method:"DELETE"}});return d.newDeal=function(){var a=new Date,b=new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes()),d={ACL:{"*":{read:!0},"role:Admin":{read:!0,write:!0}},schema:[{key:"deal_start_date",__type:"Date"},{key:"deal_end_date",__type:"Date"},{key:"user",__type:"Pointer",className:"_User"}],deal_start_date:b,deal_end_date:b,end_utc:b.valueOf(),start_utc:b.valueOf()};return d.ACL[c.userId]={read:!0,write:!0},d.user=c.userId,d.approved=!1,d.num_accepted=0,d},d}]),angular.module("barliftApp").controller("BarCtrl",["$scope","$location","User","Deals","AuthService",function(a,b,c,d,e){a.user={},a.deals=[],a.selectedDeal={},a.selectedDeal=d.newDeal(a.user),c.getCurrent(function(b){a.user=b,d.query({where:{user:a.user.getPointer}},function(b){a.deals=b})}),a.newDeal=function(){a.selectedDeal=d.newDeal(a.user)},a.logout=e.logout}]),angular.module("barliftApp").directive("dealList",["$window",function(){return{templateUrl:"views/deallist.html",restrict:"E",scope:{deals:"=",select:"="},link:function(a){a.selectDeal=function(b){a.select=b}}}}]),angular.module("barliftApp").directive("dealForm",["ParseTypes","Deals","Push",function(a,b){return{templateUrl:"views/dealform.html",restrict:"E",scope:{deals:"=",deal:"=",user:"="},link:function(a){a.isNew=!0,a.$watch("deal",function(){a.isNew=a.deal.objectId?!1:!0}),a.saveDeal=function(c){c.start_utc=c.deal_start_date.valueOf(),c.end_utc=c.deal_end_date.valueOf(),b.save(c,function(d){c.objectId=d.objectId,a.deals.push(c),a.deal=b.newDeal(a.user)})},a.updateDeal=function(c){c.start_utc=c.deal_start_date.valueOf(),c.end_utc=c.deal_end_date.valueOf(),b.update(c,function(){a.deal=b.newDeal(a.user),a.isNew=!0,a.dealForm.$setPristine(),a.dealForm.$setUntouched()})},a.deleteDeal=function(c){b["delete"](c,function(){var d=a.deals.indexOf(c);d>-1&&a.deals.splice(d,1),a.deal=b.newDeal(a.user),a.isNew=!0,a.dealForm.$setPristine(),a.dealForm.$setUntouched()})},a.clearDeal=function(){a.deal=b.newDeal(a.user),a.isNew=!0,a.dealForm.$setPristine(),a.dealForm.$setUntouched()}}}}]),angular.module("barliftApp").factory("ParseTypes",function(){return{resProcess:function(a,b){var c=Object.keys(a);a.schema=[];for(var d=0;d<c.length;d++)if(a[c[d]].__type){var e=a[c[d]].__type;switch(e){case"Pointer":a.schema.push({key:c[d],__type:a[c[d]].__type,className:a[c[d]].className}),a[c[d]]=a[c[d]].objectId;break;case"Date":a.schema.push({key:c[d],__type:a[c[d]].__type}),a[c[d]]=new Date(a[c[d]].iso);break;case"GeoPoint":a.schema.push({key:c[d],__type:a[c[d]].__type}),a[c[d]]={latitude:a[c[d]].latitude,longitude:a[c[d]].longitude}}}return a.getPointer=function(){return{objectId:a.objectId,__type:"Pointer",className:b}},a},reqProcess:function(a){var b=angular.copy(a),c=b.schema;if(c){for(var d=0;d<c.length;d++){var e=c[d].__type,f=b[c[d].key];switch(e){case"Pointer":var g={objectId:f,__type:c[d].__type,className:c[d].className};b[c[d].key]=g;break;case"Date":var h={iso:f,__type:c[d].__type};b[c[d].key]=h;break;case"GeoPoint":var i={__type:c[d].__type,latitude:f.latitude,longitude:f.longitude};b[c[d].key]=i}}delete b.schema}return delete b.getPointer,b}}}),angular.module("barliftApp").factory("AuthService",["$http","$location","$window","Session","User",function(a,b,c,d){var e={};return e.login=function(b){return a({url:"https://api.parse.com/1/login",method:"GET",params:b}).then(function(a){return d.create(a.data.objectId,a.data.username,a.data.sessionToken,""),a.data.objectId}).then(function(b){return a({url:"https://api.parse.com/1/roles",method:"GET",params:{where:{users:{$in:[{__type:"Pointer",className:"_User",objectId:b}]}}}})}).then(function(a){d.setRole(a.data.results[0].name),c.sessionStorage.session=JSON.stringify(d)})},e.logout=function(){d.destroy(),delete c.sessionStorage.session,b.path("/login")},e.isAuthenticated=function(){return!!d.userId},e.isAuthorized=function(a){return angular.isArray(a)||(a=[a]),-1!==a.indexOf("*")||e.isAuthenticated()&&-1!==a.indexOf(d.userRole)},e}]),angular.module("barliftApp").service("Session",["$http",function(a){return this.create=function(b,c,d,e){this.userId=b,this.userName=c,this.sessionToken=d,this.userRole=e,a.defaults.headers.common["X-Parse-Session-Token"]=d},this.setRole=function(a){this.userRole=a},this.destroy=function(){this.username=null,this.sessionToken=null,this.userRole=null,this.userId=null,delete a.defaults.headers.common["X-Parse-Session-Token"]},this}]),angular.module("barliftApp").factory("Emails",["$resource","ParseTypes",function(a){var b=a("https://api.parse.com/1/classes/email/");return b}]),angular.module("barliftApp").directive("userForm",["User",function(a){return{templateUrl:"views/userform.html",restrict:"E",scope:{user:"="},link:function(b){b.details={},b.$watch("details",function(a){a.geometry&&(b.user.location.latitude=a.geometry.location.k,b.user.location.longitude=a.geometry.location.D)}),b.updateUser=function(b){a.update(b,function(){})}}}}]),angular.module("barliftApp").directive("ngAutocomplete",function(){return{require:"ngModel",scope:{ngModel:"=",options:"=?",details:"=?"},link:function(a,b,c,d){var e,f=!1,g=function(){e={},a.options&&(f=a.options.watchEnter!==!0?!1:!0,a.options.types?(e.types=[],e.types.push(a.options.types),a.gPlace.setTypes(e.types)):a.gPlace.setTypes([]),a.options.bounds?(e.bounds=a.options.bounds,a.gPlace.setBounds(e.bounds)):a.gPlace.setBounds(null),a.options.country?(e.componentRestrictions={country:a.options.country},a.gPlace.setComponentRestrictions(e.componentRestrictions)):a.gPlace.setComponentRestrictions(null))};void 0==a.gPlace&&(a.gPlace=new google.maps.places.Autocomplete(b[0],{})),google.maps.event.addListener(a.gPlace,"place_changed",function(){var c=a.gPlace.getPlace();void 0!==c&&(void 0!==c.address_components?a.$apply(function(){a.details=c,d.$setViewValue(b.val())}):f&&h(c))});var h=function(c){var e=new google.maps.places.AutocompleteService;c.name.length>0&&e.getPlacePredictions({input:c.name,offset:c.name.length},function(c){if(null==c||0==c.length)a.$apply(function(){a.details=null});else{var e=new google.maps.places.PlacesService(b[0]);e.getDetails({reference:c[0].reference},function(c,e){e==google.maps.GeocoderStatus.OK&&a.$apply(function(){d.$setViewValue(c.formatted_address),b.val(c.formatted_address),a.details=c;b.on("focusout",function(){b.val(c.formatted_address),b.unbind("focusout")})})})}})};d.$render=function(){var a=d.$viewValue;b.val(a)},a.watchOptions=function(){return a.options},a.$watch(a.watchOptions,function(){g()},!0)}}}),angular.module("barliftApp").factory("Push",["$resource","ParseTypes",function(a,b){var c=a("https://api.parse.com/1/push",null,{push:{method:"POST",transformRequest:function(a){var c=b.reqProcess(a);return c=angular.toJson(c)}}});return c}]),angular.module("barliftApp").directive("dealGrid",function(){return{templateUrl:"views/dealgrid.html",restrict:"E",link:function(){}}}),angular.module("barliftApp").directive("dealCard",function(){return{templateUrl:"views/dealcard.html",restrict:"E",scope:{deal:"="},link:function(){}}}),angular.module("barliftApp").directive("sideBar",function(){return{templateUrl:"views/sidebar.html",restrict:"E",link:function(){}}});