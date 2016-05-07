angular.module('todoApp')
.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    // .state('home', {
    //   url: "/home",
    //   templateUrl: "src/view/home.tmpl"
    // })
    // .state('changepage', {
    //   url: "/changepage",
    //   templateUrl: "src/view/changepage.tmpl"
    // })
    .state('login', {
      url: "/login",
      templateUrl: "src/view/login.tmpl"
    })
    .state('registration', {
      url: "/registration",
      templateUrl: "src/view/registration.tmpl"
    })
    .state('user_profile', {
      url: "/user_information/user_profile",
      templateUrl: "src/view/user_information.tmpl"
    })
    .state('registeration_information', {
      url: "/user_information/registeration_information",
      templateUrl: "src/view/registeration_information.tmpl"
    })
});
