"use strict";angular.module("barliftApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","ui.router","oc.lazyLoad","ui.calendar","angularPayments","cgNotify"]).constant("AUTH_EVENTS",{loginSuccess:"auth-login-success",loginFailed:"auth-login-failed",logoutSuccess:"auth-logout-success",sessionTimeout:"auth-session-timeout",notAuthenticated:"auth-not-authenticated",notAuthorized:"auth-not-authorized"}).constant("USER_ROLES",{all:"*",admin:"Admin",editor:"User",bar:"Bar"}).run(["$rootScope","$http","$window","$state","AUTH_EVENTS","AuthService","Session","notify",function(a,b,c,d,e,f,g,h){if(a.$state=d,b.defaults.headers.common["X-Parse-Application-Id"]="5DZi1FrdZcwBKXIxMplWsqYu3cEEumlmFDB1kKnC",b.defaults.headers.common["X-Parse-REST-API-Key"]="pMT9AefpMkJfbcJ5fTA2uOGxwpitMII7hpCt8x4O",c.sessionStorage.session){var i=JSON.parse(c.sessionStorage.session);g.create(i.userId,i.userName,i.sessionToken,i.userRole)}h.config({position:"center"}),a.$on("notify",function(a,b){h({message:b.message,classes:b.cssClass,templateUrl:"views/dash/common/notify.html"})}),a.$on("$stateChangeStart",function(b,c){var g=c.data.authorizedRoles;f.isAuthorized(g)||(b.preventDefault(),f.isAuthenticated()?(a.$broadcast(e.notAuthorized),d.go("login")):(a.$broadcast(e.notAuthenticated),d.go("login")))})}]).factory("AuthInterceptor",["$rootScope","$q","AUTH_EVENTS",function(a,b,c){return{responseError:function(d){return a.$broadcast({401:c.notAuthenticated,403:c.notAuthorized,419:c.sessionTimeout,440:c.sessionTimeout}[d.status],d),b.reject(d)}}}]),angular.module("barliftApp").config(["$stateProvider","$urlRouterProvider","$ocLazyLoadProvider","$httpProvider","USER_ROLES","$locationProvider",function(a,b,c,d,e,f){f.html5Mode(!0),b.otherwise("/login"),Stripe.setPublishableKey("pk_test_ilf0PC8WC51SBXQMp8zQFjXi"),c.config({debug:!1}),a.state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl",data:{authorizedRoles:[e.all]}}).state("register",{url:"/register",templateUrl:"views/register.html",controller:"LoginCtrl",data:{authorizedRoles:[e.admin]}}).state("reset",{url:"/reset",templateUrl:"views/reset.html",controller:"LoginCtrl",data:{authorizedRoles:[e.all]}}).state("dash",{"abstract":!0,controller:"AdminCtrl",templateUrl:"views/dash/common/content.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("dash.main",{url:"/dashboard",controller:"DashboardCtrl",templateUrl:"views/dash/dash.main.html",data:{authorizedRoles:[e.admin,e.bar]},resolve:{loadPlugin:["$ocLazyLoad",function(a){return a.load([{name:"angles",files:["js/plugins/chartJs/angles.js","js/plugins/chartJs/Chart.min.js"]},{name:"google apis",files:["https://apis.google.com/js/client.js"]}])}]}}).state("feedback",{url:"/feedback/:dealId",templateUrl:"views/dash/feedback.html",controller:"FeedbackCtrl",data:{authorizedRoles:[e.all]}}).state("deals",{"abstract":!0,url:"/deals",templateUrl:"views/dash/common/content.html",controller:"DealsviewCtrl",data:{authorizedRoles:[e.admin,e.bar]}}).state("deals.list",{url:"/list",templateUrl:"views/dash/deals.list.html",data:{authorizedRoles:[e.admin,e.bar]},resolve:{loadPlugin:["$ocLazyLoad",function(a){return a.load([{name:"datePicker",files:["css/plugins/datapicker/angular-datapicker.css","js/plugins/datapicker/datePicker.js"]}])}]}}).state("deals.builder",{url:"/builder/:selectedDeal?dup",templateUrl:"views/dash/deals.builder.html",data:{authorizedRoles:[e.admin,e.bar]},resolve:{loadPlugin:["$ocLazyLoad",function(a){return a.load([{name:"datePicker",files:["css/plugins/datapicker/angular-datapicker.css","js/plugins/datapicker/datePicker.js"]}])}]}}).state("deals.analytics",{url:"/deal/:selectedDeal",templateUrl:"views/dash/deals.analytics.html",controller:"AnalyticsCtrl",data:{authorizedRoles:[e.admin,e.bar]},resolve:{loadPlugin:["$ocLazyLoad",function(a){return a.load([{serie:!0,name:"angular-flot",files:["js/plugins/flot/jquery.flot.js","js/plugins/flot/jquery.flot.time.js","js/plugins/flot/jquery.flot.tooltip.min.js","js/plugins/flot/jquery.flot.spline.js","js/plugins/flot/jquery.flot.resize.js","js/plugins/flot/jquery.flot.pie.js","js/plugins/flot/curvedLines.js","js/plugins/flot/angular-flot.js"]},{name:"angles",files:["js/plugins/chartJs/angles.js","js/plugins/chartJs/Chart.min.js"]},{name:"mixpanel",files:["js/plugins/md5/jquery.md5.min.js"]}])}]}}).state("promo",{"abstract":!0,url:"/promo",templateUrl:"views/dash/common/content.html",controller:"PromoteviewCtrl",data:{authorizedRoles:[e.admin,e.bar]}}).state("promo.push",{url:"/push",templateUrl:"views/dash/promo.push.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile",{"abstract":!0,url:"/profile",templateUrl:"views/dash/common/content.html",controller:"ProfileviewCtrl",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.venues",{url:"/venues",templateUrl:"views/dash/profile.venues.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.invoice",{url:"/invoice",templateUrl:"views/dash/profile.invoice.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.account",{url:"/account",templateUrl:"views/dash/profile.account.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.payment",{url:"/payment",templateUrl:"views/dash/profile.payment.html",data:{authorizedRoles:[e.admin,e.bar]},resolve:{loadPlugin:["$ocLazyLoad",function(a){return a.load([{files:["css/plugins/steps/jquery.steps.css"]}])}]}}).state("profile.payment.one_sub",{url:"/step_one",templateUrl:"views/dash/payments_wizard/one_sub.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.payment.two_card",{url:"/step_two",templateUrl:"views/dash/payments_wizard/two_card.html",data:{authorizedRoles:[e.admin,e.bar]}}).state("profile.payment.three_review",{url:"/step_three",templateUrl:"views/dash/payments_wizard/three_review.html",data:{authorizedRoles:[e.admin,e.bar]}}),d.interceptors.push(["$injector",function(a){return a.get("AuthInterceptor")}])}]),$(document).ready(function(){function a(){var a=$("body > #wrapper").height()-61;$(".sidebard-panel").css("min-height",a+"px");var b=$("nav.navbar-default").height(),c=$("#page-wrapper").height();b>c&&$("#page-wrapper").css("min-height",b+"px"),c>b&&$("#page-wrapper").css("min-height",$(window).height()+"px")}$(window).bind("load resize scroll",function(){$("body").hasClass("body-small")||a()}),setTimeout(function(){a()})}),$(function(){$(window).bind("load resize",function(){$(this).width()<769?$("body").addClass("body-small"):$("body").removeClass("body-small")})}),angular.module("barliftApp").controller("MainCtrl",["$scope","Emails","$location","$window","$http","$state",function(a,b,c,d,e,f){a.$state=f,a.getDevice=function(){var a=d.navigator.userAgent,b={android:/Android/i,ios:/iPhone/i};for(var c in b)if(b[c].test(a))return c;return"unknown"},a.isActive=function(a){return a===f.get()},a.slides=[{image:"images/phone-slides/1.png"},{image:"images/phone-slides/2.png"},{image:"images/phone-slides/3.png"},{image:"images/phone-slides/4.png"}]}]),angular.module("barliftApp").controller("LoginCtrl",["$rootScope","$http","$scope","$state","User","AuthService","AUTH_EVENTS","Session",function(a,b,c,d,e,f,g,h){c.credentials={username:"",password:""},f.isAuthenticated()&&d.go("dash.main"),c.$watch("credentials.username",function(){c.credentials&&(c.credentials.username=c.credentials.username.toLowerCase().replace(/\s+/g,""))}),c.$watch("user.username",function(){c.user&&(c.user.username=c.user.username.toLowerCase().replace(/\s+/g,""))}),c.register=function(a){var b=e.newBar();b.username=a.username,b.password=a.password,b.email=a.email,e.save(b).$promise.then(function(b){c.login({username:a.username,password:a.password})},function(a){c.error=a.data.error})},c.alert=null,c.reset=function(a){b.post("https://api.parse.com/1/requestPasswordReset",{email:a}).success(function(a,b,d,e){c.alert="A reset link has been sent to your email. It may be in you spam folder"}).error(function(a,b,d,e){c.alert=a.error})},c.login=function(b){f.login(b).then(function(){console.log("Logged in"),a.$broadcast(g.loginSuccess),d.go("dash.main")},function(){a.$broadcast(g.loginFailed),c.loginFail=!0})}}]),angular.module("barliftApp").controller("AdminCtrl",["$scope","User","Deals","AuthService","Venues",function(a,b,c,d,e){a.deals=[],a.venues=[],a.user={},a.selectedDeal={name:"Please select a deal"},a.dealView="list",a.dealFilter="all",b.getCurrent(function(b){a.user=b,c.query({where:{}},function(b){a.deals=b}),e.query({where:{manager:a.user.getPointer()}},function(b){a.venues=b})}),a.$on("deals-update",function(b,d){c.query(function(b){a.deals=b})}),a.selectDeal=function(b){a.selectedDeal=b},a.logout=d.logout}]),angular.module("barliftApp").factory("User",["$resource","ParseTypes","Session","Deals","Venues",function(a,b,c,d,e){var f=a("https://api.parse.com/1/users/:objectId",{objectId:"@objectId"},{getCurrent:{method:"GET",cache:!0,url:"https://api.parse.com/1/users/me",transformResponse:function(a,c){a=angular.fromJson(a);var d=b.resProcess(a,"_User");return d}},get:{method:"GET",cache:!0,transformResponse:function(a,c){return a=angular.fromJson(a),b.resProcess(a,"_User")}},save:{method:"POST",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)},transformResponse:function(a,c){return a=angular.fromJson(a),b.resProcess(a,"_User")}},query:{method:"GET",isArray:!0,transformResponse:function(a,c){a=angular.fromJson(a);var d=a.results,e=d.map(function(a){return b.resProcess(a,"_User")});return e}},update:{method:"PUT",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)},transformResponse:function(a,c){return a=angular.fromJson(a),b.resProcess(a,"_User")}}});return f.newBar=function(){var a={ACL:{"*":{read:!0}},schema:[{key:"Role",__type:"Pointer",className:"_Role"}],Role:"VyofaLB7t2"};return a},f}]),angular.module("barliftApp").factory("Deals",["$resource","ParseTypes","Session",function(a,b,c){var d=a("https://api.parse.com/1/classes/Deal/:objectId",{objectId:"@objectId"},{save:{method:"POST",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},get:{transformResponse:function(a,c){return a=angular.fromJson(a),b.resProcess(a,"Deal")}},query:{isArray:!0,transformResponse:function(a,c){a=angular.fromJson(a);var d=a.results,e=d.map(function(a){return b.resProcess(a,"Deal")});return e}},update:{method:"PUT",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},"delete":{method:"DELETE"}});return d.newDeal=function(a){var b=moment().add(3,"day").toDate(),d={ACL:{"*":{},"role:Admin":{read:!0,write:!0},"role:User":{read:!0}},schema:[{key:"deal_start_date",__type:"Date"},{key:"deal_end_date",__type:"Date"},{key:"user",__type:"Pointer",className:"_User"},{key:"venue",__type:"Pointer",className:"Venue"}],deal_start_date:b,deal_end_date:b};return d.ACL[c.userId]={read:!0,write:!0},d.user=c.userId,d.main=!1,d.num_accepted=0,d.add_deals=[],d},d}]),angular.module("barliftApp").factory("ParseTypes",function(){return{resProcess:function(a,b){var c=Object.keys(a);a.schema=[];for(var d=0;d<c.length;d++)if(a[c[d]].__type){var e=a[c[d]].__type;switch(e){case"Pointer":a.schema.push({key:c[d],__type:a[c[d]].__type,className:a[c[d]].className}),a[c[d]]=a[c[d]].objectId;break;case"Date":a.schema.push({key:c[d],__type:a[c[d]].__type}),a[c[d]]=new Date(a[c[d]].iso);break;case"GeoPoint":a.schema.push({key:c[d],__type:a[c[d]].__type}),a[c[d]]={latitude:a[c[d]].latitude,longitude:a[c[d]].longitude}}}return a.getPointer=function(){return{objectId:a.objectId,__type:"Pointer",className:b}},a},reqProcess:function(a){var b=angular.copy(a),c=b.schema;if(c){for(var d=0;d<c.length;d++){var e=c[d].__type,f=b[c[d].key];switch(e){case"Pointer":var g={objectId:f,__type:c[d].__type,className:c[d].className};b[c[d].key]=g;break;case"Date":var h={iso:f,__type:c[d].__type};b[c[d].key]=h;break;case"GeoPoint":var i={__type:c[d].__type,latitude:f.latitude,longitude:f.longitude};b[c[d].key]=i}}delete b.schema}return delete b.getPointer,b}}}),angular.module("barliftApp").factory("AuthService",["$http","$location","$window","Session","User",function(a,b,c,d,e){var f={};return f.login=function(b){return a({url:"https://api.parse.com/1/login",method:"GET",params:b}).then(function(a){return d.create(a.data.objectId,a.data.username,a.data.sessionToken,""),a.data.Role.objectId}).then(function(b){return a({url:"https://api.parse.com/1/roles/"+b,method:"GET"})}).then(function(a){d.setRole(a.data.name),c.sessionStorage.session=JSON.stringify(d)})},f.logout=function(){d.destroy(),delete c.sessionStorage.session,b.path("/login")},f.isAuthenticated=function(){return!!d.userId},f.isAuthorized=function(a){return angular.isArray(a)||(a=[a]),-1!==a.indexOf("*")||f.isAuthenticated()&&-1!==a.indexOf(d.userRole)},f}]),angular.module("barliftApp").service("Session",["$http",function(a){return this.create=function(b,c,d,e){this.userId=b,this.userName=c,this.sessionToken=d,this.userRole=e,a.defaults.headers.common["X-Parse-Session-Token"]=d},this.setRole=function(a){this.userRole=a},this.destroy=function(){this.username=null,this.sessionToken=null,this.userRole=null,this.userId=null,delete a.defaults.headers.common["X-Parse-Session-Token"]},this}]),angular.module("barliftApp").factory("Emails",["$resource","ParseTypes",function(a,b){var c=a("https://api.parse.com/1/classes/email/");return c}]),angular.module("barliftApp").directive("ngAutocomplete",function(){return{require:"ngModel",scope:{ngModel:"=",options:"=?",details:"=?"},link:function(a,b,c,d){var e,f=!1,g=function(){e={},a.options&&(f=a.options.watchEnter!==!0?!1:!0,a.options.types?(e.types=[],e.types.push(a.options.types),a.gPlace.setTypes(e.types)):a.gPlace.setTypes([]),a.options.bounds?(e.bounds=a.options.bounds,a.gPlace.setBounds(e.bounds)):a.gPlace.setBounds(null),a.options.country?(e.componentRestrictions={country:a.options.country},a.gPlace.setComponentRestrictions(e.componentRestrictions)):a.gPlace.setComponentRestrictions(null))};void 0==a.gPlace&&(a.gPlace=new google.maps.places.Autocomplete(b[0],{})),google.maps.event.addListener(a.gPlace,"place_changed",function(){var c=a.gPlace.getPlace();void 0!==c&&(void 0!==c.address_components?a.$apply(function(){a.details=c,d.$setViewValue(b.val())}):f&&h(c))});var h=function(c){var e=new google.maps.places.AutocompleteService;c.name.length>0&&e.getPlacePredictions({input:c.name,offset:c.name.length},function(c,e){if(null==c||0==c.length)a.$apply(function(){a.details=null});else{var f=new google.maps.places.PlacesService(b[0]);f.getDetails({reference:c[0].reference},function(c,e){e==google.maps.GeocoderStatus.OK&&a.$apply(function(){d.$setViewValue(c.formatted_address),b.val(c.formatted_address),a.details=c;b.on("focusout",function(a){b.val(c.formatted_address),b.unbind("focusout")})})})}})};d.$render=function(){var a=d.$viewValue;b.val(a)},a.watchOptions=function(){return a.options},a.$watch(a.watchOptions,function(){g()},!0)}}}),angular.module("barliftApp").factory("Push",["$resource","ParseTypes",function(a,b){var c=a("https://api.parse.com/1/push",null,{push:{method:"POST",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}}});return c}]),angular.module("barliftApp").directive("pageTitle",["$rootScope","$timeout",function(a,b){return{link:function(c,d,e){var f=function(a,c,e,f,g){var h="INSPINIA | Responsive Admin Theme";c.data&&c.data.pageTitle&&(h="INSPINIA | "+c.data.pageTitle),b(function(){d.text(h)})};a.$on("$stateChangeStart",f)}}}]),angular.module("barliftApp").directive("sideNavigation",["$timeout",function(a){return{restrict:"A",link:function(b,c){a(function(){c.metisMenu()});var d=c.parent();d.slimScroll({height:"100%",railOpacity:.9})}}}]),angular.module("barliftApp").directive("iboxTools",["$timeout",function(a){return{scope:!0,templateUrl:"views/dash/common/ibox_tools.html",restrict:"A",controller:["$scope","$element",function(b,c){b.showhide=function(){var b=c.closest("div.ibox"),d=c.find("i:first"),e=b.find("div.ibox-content");e.slideToggle(200),d.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),b.toggleClass("").toggleClass("border-bottom"),a(function(){b.resize(),b.find("[id^=map-]").resize()},50)},b.closebox=function(){var a=c.closest("div.ibox");a.remove()}}]}}]),angular.module("barliftApp").directive("minimalizaSidebar",function(){return{restrict:"A",template:'<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',controller:["$scope","$element",function(a,b){a.minimalize=function(){$("body").toggleClass("mini-navbar"),!$("body").hasClass("mini-navbar")||$("body").hasClass("body-small")?($("#side-menu").hide(),setTimeout(function(){$("#side-menu").fadeIn(500)},100)):$("body").hasClass("fixed-sidebar")?($("#side-menu").hide(),setTimeout(function(){$("#side-menu").fadeIn(500)},300)):$("#side-menu").removeAttr("style")}}]}}),angular.module("barliftApp").directive("dealBuilder",["Deals","Venues","$http","$stateParams","$state","$rootScope","$filter",function(a,b,c,d,e,f,g){return{templateUrl:"views/dash/directives/deal-builder.html",restrict:"E",scope:{user:"=",venues:"="},link:function(b,h,i){b.alert={},d.selectedDeal?a.get({objectId:d.selectedDeal},function(a){b.deal=a,d.dup&&(b.deal.objectId=null)}):b.deal=a.newDeal(b.user),b.$watch("deal.venue",function(){b.deal&&b.deal.venue?b.deal.image_url=g("filter")(b.venues,{objectId:b.deal.venue})[0].image_url:b.deal&&(b.deal.image_url=null)}),c.get("https://api.parse.com/1/config").success(function(a,c,d,e){b.communities=a.params.communities}),b.addSubDeal=function(){b.deal.add_deals.push("")},b.removeSubDeal=function(a){b.deal.add_deals.splice(a,1)},b.deleteDeal=function(){a["delete"](b.deal).$promise.then(function(c){b.deal=a.newDeal(b.user),f.$broadcast("deals-update"),b.$emit("notify",{cssClass:"alert-success",message:"Your Deal has been deleted"}),e.go("deals.list")},function(a){b.alert.text=a.data.error})},b.saveDeal=function(){b.deal.community_name=b.deal.community_name.replace(" ",""),a.save(b.deal).$promise.then(function(c){b.deal=a.newDeal(b.user),f.$broadcast("deals-update"),b.$emit("notify",{cssClass:"alert-success",message:"Your Deal has been added"}),e.go("deals.list")},function(a){b.alert.text=a.data.error})},b.duplicateDeal=function(){b.deal.objectId=null},b.updateDeal=function(){b.deal.community_name=b.deal.community_name.replace(" ",""),a.update(b.deal).$promise.then(function(c){b.deal=a.newDeal(b.user),f.$broadcast("deals-update"),b.$emit("notify",{cssClass:"alert-success",message:"Your Deal has been updated"}),e.go("deals.list")},function(a){b.alert.text=a.data.error})}}}}]),angular.module("barliftApp").factory("Yelp",["$http",function(a){function b(a,b){for(var c="",d=a;d>0;--d)c+=b[Math.round(Math.random()*(b.length-1))];return c}return{getBusiness:function(c){var d="GET",e="http://api.yelp.com/v2/business/"+c,f={callback:"angular.callbacks._0",oauth_consumer_key:"Zm9xJcBs-wTA2xgNsYwUHQ",oauth_token:"KLi_UOL1kXiRjL46U7MaMFasADLeMS24",oauth_signature_method:"HMAC-SHA1",oauth_timestamp:(new Date).getTime(),oauth_nonce:b(32,"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")},g="dIbUA7qGcUovMxYz0Y9fYevD1dw",h="l7iJTLAp73HHm5_R8ac2LzNX7po",i=oauthSignature.generate(d,e,f,g,h,{encodeSignature:!1});return f.oauth_signature=i,a.jsonp(e,{params:f})}}}]),angular.module("barliftApp").directive("venueBuilder",["Venues","User","Yelp","$rootScope",function(a,b,c,d){return{templateUrl:"views/dash/directives/venue-builder.html",restrict:"E",scope:{},link:function(d,e,f){function g(){a.query({},function(a){d.venues=a})}function h(a,b){var c=new google.maps.Geocoder;c.geocode({address:a},function(a,c){c==google.maps.GeocoderStatus.OK&&b(a[0].geometry.location)})}d.user={},d.venues=[],d.venue=a.newVenue(d.user),b.getCurrent(function(a){d.user=a,g()}),d.editVenue=function(a){d.venue=a},d.deleteVenue=function(b){a["delete"](b,function(b){g(),d.venue=a.newVenue(d.user)})},d.loadYelp=function(){var a=d.venue.yelpId.replace("http://","");a=a.replace("www.yelp.com/biz/",""),c.getBusiness(a).success(function(a){d.venue.bar_name=a.name,d.venue.display_phone=a.display_phone,d.venue.image_url=a.image_url,d.venue.address=a.location.display_address[0]+" "+a.location.display_address[1]})},d["delete"]=function(){a["delete"](d.venue,function(b){g(),d.venue=a.newVenue(d.user)})},d.cancel=function(){g(),d.venue=a.newVenue(d.user)},d.save=function(){if(d.locationDetails){var b=d.locationDetails.geometry.location;d.venue.location={latitude:b.A,longitude:b.F},a.save(d.venue,function(b){g(),d.venue=a.newVenue(d.user)})}else var b=h(d.venue.address,function(b){d.venue.location={latitude:b.A,longitude:b.F},a.save(d.venue,function(b){g(),d.venue=a.newVenue(d.user)})})},d.update=function(){if(d.locationDetails){var b=d.locationDetails.geometry.location;d.venue.location={latitude:b.A,longitude:b.F},a.update(d.venue,function(b){g(),d.venue=a.newVenue(d.user)})}else var b=h(d.venue.address,function(b){d.venue.location={latitude:b.A,longitude:b.F},a.update(d.venue,function(b){g(),d.venue=a.newVenue(d.user)})})}}}}]),angular.module("barliftApp").factory("Venues",["$resource","ParseTypes","Session",function(a,b,c){var d=a("https://api.parse.com/1/classes/Venue/:objectId",{objectId:"@objectId"},{save:{method:"POST",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},get:{transformResponse:function(a,c){return a=angular.fromJson(a),b.resProcess(a,"Venue")}},query:{isArray:!0,transformResponse:function(a,c){a=angular.fromJson(a);var d=a.results,e=d.map(function(a){return b.resProcess(a,"Venue")});return e}},update:{method:"PUT",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},"delete":{method:"DELETE"}});return d.newVenue=function(a){var b={ACL:{"*":{},"role:Admin":{read:!0,write:!0},"role:User":{read:!0}},schema:[{key:"location",__type:"GeoPoint"},{key:"manager",__type:"Pointer",className:"_User"}]};return b.ACL[c.userId]={read:!0,write:!0},b.manager=c.userId,b},d}]),angular.module("barliftApp").controller("FeedbackCtrl",["$scope","Deals","Feedback","$modalInstance","dealID",function(a,b,c,d,e){a.deal={},a.feedback={},a.submitted=!1,a.update=!1,a.deleted=!1,b.get({objectId:e,include:"user",inlcude:"feedback"},function(b){a.deal=b,a.feedback.deal=a.deal.getPointer(),a.feedback.name=a.deal.name,b.feedback&&c.get({objectId:b.feedback},function(b){a.feedback=b,a.update=!0},function(b){console.log("Feedback deleted",b),a.deleted="true"})}),a.submit=function(){a.update?c.update(a.feedback):c.save(a.feedback).$promise.then(function(c){return a.deal.user=f(a.deal.user.objectId,"_User"),a.deal.feedback=a.deleted?c.objectId:f(c.objectId,"Feedback"),b.update(a.deal).$promise}).then(function(a){},function(a){console.log("Error saving object",a)}),d.close(a.feedback)};var f=function(a,b){return{objectId:a,__type:"Pointer",className:b}}}]),angular.module("barliftApp").factory("Feedback",["$resource","ParseTypes","Session",function(a,b,c){var d=a("https://api.parse.com/1/classes/Feedback/:objectId",{objectId:"@objectId"},{save:{method:"POST",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},get:{transformResponse:function(a,c){a=angular.fromJson(a);a.results;return b.resProcess(a,"Feedback")}},query:{isArray:!0,transformResponse:function(a,c){a=angular.fromJson(a);var d=a.results,e=d.map(function(a){return b.resProcess(a,"Feedback")});return e}},update:{method:"PUT",transformRequest:function(a,c){var d=b.reqProcess(a);return d=angular.toJson(d)}},"delete":{method:"DELETE"}});return d.newFeedback=function(){var a=new Date,b=new Date(a.getFullYear(),a.getMonth(),a.getDate()),d={ACL:{"*":{read:!0},"role:Admin":{read:!0,write:!0}},schema:[{key:"deal_start_date",__type:"Date"},{key:"deal_end_date",__type:"Date"},{key:"user",__type:"Pointer",className:"_User"}],deal_start_date:b,deal_end_date:b};return d.ACL[c.userId]={read:!0,write:!0},d},d}]),angular.module("barliftApp").factory("CloudCode",["$http","$q",function(a,b){return{call:function(c,d){return a.post("https://api.parse.com/1/functions/"+c,d).then(function(a){return a.data},function(a){return b.reject(a)})}}}]),angular.module("barliftApp").directive("promoBuilder",["ParseTypes","$q","$state",function(a,b,c){return{templateUrl:"views/dash/directives/promo-builder.html",restrict:"E",scope:{deals:"="},controller:["$scope","CloudCode",function(a,d){function e(){angular.forEach(a.deals,function(b){var c=!1;if(angular.forEach(a.events,function(d,e){angular.equals(d.deal,b)?c=!0:d.deal.objectId===b.objectId&&a.events.splice(e,1)}),!c){var d=[];b.main?d=["main-event","unselectable-event"]:b.eligible_main||(d=["past-event","unselectable-event"]),a.events.push({title:b.name,editable:!1,start:b.deal_start_date,deal:b,className:d})}})}function f(b){d.call("pushCount",{community:b.community_name}).then(function(c){b.main_price=.02*c.result,a.total+=.02*c.result,a.selectedDeals.push(b)})}a.events=[],a.selectedDeals=[],a.eventSource=[a.events],a.total=0,a.$watch("deals",function(){e()}),a.alertOnEventClick=function(b,c,d,e){if(b.deal.eligible_main)if(b.selected){b.selected=!1;var g=b.className.indexOf("selected-event");b.className.splice(g,1);var h=a.selectedDeals.indexOf(b.deal);a.selectedDeals.splice(h,1),a.total-=b.deal.main_price}else b.selected=!0,b.className.push("selected-event"),f(b.deal)},a.buyDeals=function(){function e(a){console.log(a)}var f=[];angular.forEach(a.selectedDeals,function(a){f.push(d.call("buyPush",{amount:a.main_price,description:a.name,deal:a.objectId}).then(e))}),b.all(f).then(function(){a.$emit("notify",{cssClass:"alert-success",message:"Your deals of the day have been added to your invoice"}),c.go("profile.invoice")})},a.uiConfig={calendar:{height:450,editable:!0,header:{left:"",center:"title",right:"today prev,next"},eventClick:a.alertOnEventClick}}}],link:function(a,b,c){}}}]),angular.module("barliftApp").directive("fullScroll",["$timeout",function(a){return{restrict:"A",link:function(b,c){a(function(){c.slimscroll({height:"100%",railOpacity:.9})})}}}]),angular.module("barliftApp").directive("dealCalendar",function(){return{templateUrl:"views/dash/directives/deal-calendar.html",restrict:"E",scope:{deals:"=",openFeedback:"&"},controller:["$scope","$filter",function(a,b){function c(){angular.forEach(a.deals,function(b){var c=!1;if(angular.forEach(a.events,function(d,e){angular.equals(d.deal,b)?c=!0:d.deal.objectId===b.objectId&&a.events.splice(e,1)}),!c){var d="";a.pastDate(b.deal_start_date,a.today)?d="past-event":b.main&&(d="main-event"),a.events.push({title:b.name,editable:!1,start:b.deal_start_date,deal:b,className:d})}})}a.events=[],a.eventSource=[a.events],a.deal=null,a.today=new Date,a.$watch("deals",function(){c()}),a.sameDate=function(a,b){return moment(a).dayOfYear()===moment(b).dayOfYear()},a.pastDate=function(a,b){return moment(a).dayOfYear()<moment(b).dayOfYear()},a.isLocked=function(a){var b=moment().endOf("day").add(3,"day");return moment(a).isBetween(moment().startOf("day"),b)},a.alertOnEventClick=function(b,c,d,e){a.deal=b.deal},a.uiConfig={calendar:{height:450,editable:!0,header:{left:"",center:"title",right:"today prev,next"},eventClick:a.alertOnEventClick}}}]}}),angular.module("barliftApp").controller("DealsviewCtrl",["$rootScope","$scope","User","Deals","AuthService","Venues","$modal",function(a,b,c,d,e,f,g){b.deals=[],b.venues=[],b.user={},b.selectedDeal={},b.selectedVenue={},b.today=new Date,b.logout=e.logout,b.dealView="calendar",c.getCurrent(function(a){b.user=a,d.query({where:{}},function(a){b.deals=a}),f.query({},function(a){b.venues=a})}),b.$on("deals-update",function(a,c){d.query(function(a){b.deals=a})}),b.dealDate=function(a){return a.deal_start_date.valueOf()},b.logout=e.logout,b.alerts=[],b.addAlert=function(a){b.alerts.push(a)},b.closeAlert=function(a){b.alerts.splice(a,1)},b.openFeedback=function(a){var c=g.open({templateUrl:"views/dash/deals.feedback.html",controller:"FeedbackCtrl",resolve:{dealID:function(){return a}}});c.result.then(function(a){b.addAlert({type:"success",msg:"Thank you for your feedback!"})})}}]),angular.module("barliftApp").controller("ProfileviewCtrl",["$scope","AuthService","User","Venues","$state","CloudCode",function(a,b,c,d,e,f){a.logout=b.logout,a.user={},a.selectedVenue=d.newVenue(a.user),a.alert=null,a.invoices=[],a.payments={plans:[{name:"Basic",cost:30,details:"Unlimited Deals per month, Pay per push.",id:"basic_plan"}]},c.getCurrent(function(b){a.user=b}),a.processCard=function(b,c){c.error?a.alert=c.error.message||c.error:(a.token=c.id,a.alert=null,e.go("profile.payment.three_review"))},a.createSub=function(){f.call("subscribe",{token:a.token,plan:a.payments.plans[a.payments.subPlan].id,name:a.payments.name},function(a){e.go("profile.invoice")})},f.call("getUpComingInvoice",{}).then(function(b){a.invoices=b.result.data}),a.updateUser=function(){c.update(a.user).$promise.then(function(b){a.alert=null,a.$emit("notify",{cssClass:"alert-success",message:"Your account has been updated"}),e.go("dash.main")},function(b){a.alert={text:b.data.error}})}}]),angular.module("barliftApp").controller("DashboardCtrl",["$scope","AuthService","User","Deals","CloudCode","$http","googleCalendar","$ocLazyLoad",function(a,b,c,d,e,f,g,h){a.logout=b.logout,a.user={},c.getCurrent(function(b){a.user=b,d.query({},function(c){d.query({where:{user:a.user.getPointer()}},function(d){a.allDeals=c,p("admin"==b.username?c:d)})})}),f.jsonp("http://api.wunderground.com/api/f2a7d6ad5a260a8a/forecast10day/q/IL/Evanston.json?callback=JSON_CALLBACK").success(function(b,c,d,e){a.weather=b.forecast.simpleforecast.forecastday}).error(function(a,b,c,d){console.log("Couldn't get weather",a)});var i=function(){a.upcomingDealsEvents=[],a.numUpcomingDeals=0;var b=new Date;b.setHours(0,0,0,0);for(var c=new Date,d=0;7>d;d++){var e=new Date;c.setHours(0,0,0,0);var f={date:c,deals:[],events:[]};a.upcomingDealsEvents[d]=f,e.setDate(c.getDate()+1),c=e}angular.forEach(a.deals,function(c){var d=c.deal_start_date,e=Math.floor((d-b)/864e5);e>=0&&7>e&&(a.upcomingDealsEvents[e].deals.push(c),a.numUpcomingDeals+=1)})},j=function(){a.numUpcomingEvents=0;var b=new Date;b.setHours(0,0,0,0),angular.forEach(a.events,function(c){if(c.start.date)var d=new Date(c.start.date);else var d=new Date(c.start.dateTime);var e=new Date(d);e.setHours(0,0,0,0);var f=Math.floor((e-b)/864e5);f>=0&&7>f&&(a.upcomingDealsEvents[f].events.push(c),a.numUpcomingEvents+=1)})},k=function(a,b,c){var d=c-b+1,e=new Array(d);return angular.forEach(a,function(a){var d=new Date;d.setHours(0,0,0,0);var f=new Date(a.deal_start_date);f.setHours(0,0,0,0);var g=Math.floor((d-f)/864e5);if(g>=b&&c>=g){var h=c-g;e[h]?e[h].push(a):e[h]=[a]}}),e},l=function(){for(var a=new Date,b=a.getDay()+1,c=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],d=[],e=0;7>e;e++)b>6&&(b=0),d.push(c[b]),b+=1;return d},m=function(b,c){for(var d=k(a.deals,b,c),e=Array.apply(null,new Array(d.length)).map(Number.prototype.valueOf,0),f=0;f<d.length;f++)angular.forEach(d[f],function(a){e[f]+=a.num_accepted});return e},n=function(b,c){for(var d=k(a.deals,b,c),e=0,f=0;f<d.length;f++)angular.forEach(d[f],function(a){a.revenue&&(e+=a.revenue)});return e},o=function(){for(var b,c,d=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],e=k(a.allDeals,0,6),f=0,g=0;g<e.length;g++)angular.forEach(e[g],function(a){a.num_accepted>f&&(b=a.name,c=a.deal_start_date,f=a.num_accepted)});return{dealName:b,day:d[c.getDay()],interested:f}},p=function(b){a.deals=b,i(),a.lastWeekDays=l(),a.dealsLastWeek=k(a.deals,0,6),a.interestedLastWeek=m(0,6),a.interestedTwoWeeksBack=m(7,13);for(var c=0,d=0;d<a.interestedLastWeek.length;d++)c+=a.interestedLastWeek[d];a.numInterestedLastWeek=c;for(var c=0,d=0;d<a.interestedTwoWeeksBack.length;d++)c+=a.interestedTwoWeeksBack[d];a.numInterestedTwoWeeksBack=c,0==a.numInterestedTwoWeeksBack?a.interestedIncreaseAbs=0:(a.interestedIncrease=100*(a.numInterestedLastWeek-a.numInterestedTwoWeeksBack)/a.numInterestedTwoWeeksBack,
a.interestedIncreaseAbs=Math.abs(a.interestedIncrease));var e=o();a.mostPopularDealName=e.dealName,a.mostPopularDealDay=e.day,a.revenue=n(0,6),a.lineData={labels:a.lastWeekDays,datasets:[{label:"Two Weeks Back",fillColor:"rgba(220,220,220,0.5)",strokeColor:"rgba(220,220,220,1)",pointColor:"rgba(220,220,220,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(220,220,220,1)",data:a.interestedTwoWeeksBack},{label:"Last Week",fillColor:"rgba(26,179,148,0.5)",strokeColor:"rgba(26,179,148,0.7)",pointColor:"rgba(26,179,148,1)",pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:"rgba(26,179,148,1)",data:a.interestedLastWeek}]},a.lineOptions={scaleShowGridLines:!1,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,bezierCurve:!0,bezierCurveTension:.4,pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0};var f=g.getEvents({calendarId:"primary",timeMin:(new Date).toISOString(),singleEvents:!0,maxResults:20,orderBy:"startTime"});f.then(function(b){a.events=b,j()},function(a){console.log("Error loading events",a)})}}]),angular.module("barliftApp").directive("dealCard",["$modal",function(a){return{templateUrl:"views/dash/directives/deal-card.html",restrict:"E",scope:{deal:"=",openFeedback:"&"},link:function(b,c,d){b.today=new Date,b.sameDate=function(a,b){return moment(a).dayOfYear()===moment(b).dayOfYear()},b.pastDate=function(a,b){return moment(a).dayOfYear()<moment(b).dayOfYear()},b.isLocked=function(a){var b=moment().endOf("day").add(3,"day");return moment(a).isBetween(moment().startOf("day"),b)},b.open=function(){a.open({templateUrl:"views/dash/directives/deal-repeat-modal.html",resolve:{deal:function(){return b.deal}},controller:["$scope","$modalInstance","deal","$state","Deals",function(a,c,d,e,f){a.deal=d,a.newThings={date:new Date},a.dup=function(){e.go("deals.builder",{selectedDeal:d.objectId,dup:!0}),c.close()},a.repeat=function(){var d=angular.copy(a.deal);d.objectId=null;var e=moment(a.newThings.date).dayOfYear(),g=moment(a.deal.deal_start_date).dayOfYear(),h=e-g;d.deal_start_date=moment(d.deal_start_date).add(h,"days").toDate(),d.deal_end_date=moment(d.deal_end_date).add(h,"days").toDate(),f.save(d).$promise.then(function(b){a.$emit("deals-update"),a.$emit("notify",{cssClass:"alert-success",message:"Your Deal has been added"}),c.close()},function(a){b.alert.text=a.data.error})},a.cancel=function(){c.dismiss("cancel")}}]})}}}}]),angular.module("barliftApp").controller("PromoteviewCtrl",["$scope","AuthService","User","CloudCode","ParseTypes",function(a,b,c,d,e){a.logout=b.logout,a.deals=[],a.user={},c.getCurrent(function(b){a.user=b}),d.call("possibleMainDeals",{}).then(function(b){var c=b.result.map(function(a){return e.resProcess(a,"Deal")});a.deals=c})}]),angular.module("barliftApp").service("googleCalendar",["$q",function(a){var b={},c="1075855110201-bcja8cjst56v479kls73o888ktgg730j.apps.googleusercontent.com",d=["https://www.googleapis.com/auth/calendar.readonly"];return b.getEvents=function(e){return b.deferred=a.defer(),b.params=e,gapi.auth.authorize({client_id:c,scope:d,immediate:!0},b.loadCalendarApi),b.deferred.promise},b.loadCalendarApi=function(){gapi.client.load("calendar","v3",b.listUpcomingEvents)},b.listUpcomingEvents=function(){var a=gapi.client.calendar.events.list(b.params);a.execute(function(a){var c=a.items;b.deferred.resolve(c)})},b}]);var generateMixpanelURl=function(a,b){var c=(new Date).getTime()+1e3,d="api_key=9f892f20a7ddce5c46c49bccb9af0c9aevent=Deal Click to Detailexpire="+c+"format=jsonfrom_date="+a+'on=properties["DealID"]to_date='+b+"82da5c883b1e6cb18800ee74553f8665",e=$.md5(d),f="http://mixpanel.com/api/2.0/segmentation/?on=properties%5B%22DealID%22%5D&format=json&from_date="+a+"&expire="+c+"&sig="+e+"&to_date="+b+"&api_key=9f892f20a7ddce5c46c49bccb9af0c9a&event=Deal+Click+to+Detail&callback=JSON_CALLBACK";return f};angular.module("barliftApp").controller("AnalyticsCtrl",["$scope","$stateParams","Deals","CloudCode","$http","$modal",function(a,b,c,d,e,f){c.get({objectId:b.selectedDeal,include:"feedback"},function(b){a.deal=b}).$promise.then(function(b){var c=moment(b.deal_start_date).subtract(3,"days").format("YYYY-MM-DD"),d=moment(b.deal_end_date).add(3,"days").format("YYYY-MM-DD");e.jsonp(generateMixpanelURl(c,d)).success(function(b,c,d,e){a.mixpanel=b.data.values,j()}).error(function(a,b,c,d){console.log("Couldn't get mixpanel data",a,b,d)})}),a.openFeedback=function(){var c=f.open({templateUrl:"views/dash/deals.feedback.html",controller:"FeedbackCtrl",resolve:{dealID:function(){return b.selectedDeal}}});c.result.then(function(b){a.addAlert({type:"success",msg:"Thank you for your feedback!"}),a.deal.feedback=b})},a.alerts=[],a.addAlert=function(b){a.alerts.push(b)},a.closeAlert=function(b){a.alerts.splice(b,1)},d.call("dealAnalytics",{dealId:b.selectedDeal}).then(function(b){a.males=b.result.gender.male,a.females=b.result.gender.female,h(a)});var g={};a.nudgeData=[],d.call("getNudgesByHour",{dealID:b.selectedDeal}).then(function(b){angular.forEach(b.result,function(a){var b=new Date(a.createdAt),c=new Date(b);c.setHours(0,0,0,0),g[c]?g[c].count+=1:g[c]={utc:b.getTime(),count:1}}),angular.forEach(g,function(b){a.nudgeData.push([b.utc,b.count])}),a.nudgeData.sort(function(a,b){return a[0]-b[0]}),i()});var h=function(){a.doughnutData=[{value:a.females,color:"#a3e1d4",highlight:"#1ab394",label:"Female"},{value:a.males,color:"#b5b8cf",highlight:"#9589a6",label:"Male"}]};a.graphData=[];var i=function(){a.graphData.push({label:"Nudges sent",grow:{stepMode:"linear"},data:a.nudgeData,color:"#464f88",lines:{lineWidth:1,show:!0,fill:!0,fillColor:{colors:[{opacity:.2},{opacity:.2}]}}})},j=function(){if(a.mixpanel[b.selectedDeal]){var c=a.mixpanel[b.selectedDeal],d=[];angular.forEach(c,function(a,b){d.push([new Date(b).getTime(),a])}),a.graphData.push({label:"Deal detail clicks in the app",grow:{stepMode:"linear"},data:d,color:"#1ab394",yaxis:2,bars:{show:!0,align:"center",barWidth:5184e4,lineWidth:0}})}};a.doughnutOptions={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:45,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1},a.graphOptions={grid:{hoverable:!0,clickable:!0,tickColor:"#d5d5d5",borderWidth:0,color:"#d5d5d5"},colors:["#1ab394","#464f88"],tooltip:!0,xaxis:{mode:"time",tickSize:[3,"day"],tickLength:0,axisLabel:"Date",axisLabelUseCanvas:!0,axisLabelFontSizePixels:12,axisLabelFontFamily:"Arial",axisLabelPadding:10,color:"#d5d5d5"},yaxes:[{position:"left",color:"#d5d5d5",axisLabelUseCanvas:!0,axisLabelFontSizePixels:12,axisLabelFontFamily:"Arial",axisLabelPadding:3},{position:"right",color:"#d5d5d5",axisLabelUseCanvas:!0,axisLabelFontSizePixels:12,axisLabelFontFamily:" Arial",axisLabelPadding:67}],legend:{noColumns:1,labelBoxBorderColor:"#d5d5d5",position:"nw"}}}]);