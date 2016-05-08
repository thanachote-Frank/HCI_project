angular.module('todoApp', ['ui.router', 'angular-growl'])
.controller('TodoListController', function ($http, $location, TodoListService, growl, $rootScope, $scope, $window, $anchorScroll) {
  var todoList = this
  todoList.course_list = []
  todoList.my_courses = TodoListService.get()
  todoList.username = ""
  todoList.password = ""
  todoList.isLogin = TodoListService.status_login()
  todoList.json = {}
  // $rootScope.login = true;

  $http.get('https://whsatku.github.io/skecourses/list.json')
  .success(function(respone){
    // console.log('call manat');
    // console.log(respone)
    todoList.course_list = respone
    todoList._course_list = []
    // $http.get('https://whsatku.github.io/skecourses/combined.json')
    // .success(function(respone){
    //   todoList._course_list = respone
    //   console.log(todoList._course_list)
    //   for(var course in todoList.course_list){
    //     course = todoList.course_list[course]
    //     console.log(course)
    //     console.log(todoList._course_list[course.id].credit)
    //     course["credit"] = todoList._course_list[course.id].credit
    //     course["description"] = todoList._course_list[course.id].description
    //     course["prereq"] = todoList._course_list[course.id].prereq
    //   }
    // })
  })
  $http.get('https://whsatku.github.io/skecourses/combined.json')
  .success(function(respone){
    todoList._course_list = respone
    // console.log(todoList._course_list)
    // var keys = [];
    for (var key in todoList._course_list) {
      $http.get('https://whsatku.github.io/skecourses/sections/' + key + '.json')
      .success((function(key){
        return function(respone){
          todoList._course_list[key]['sections'] = respone
          todoList._course_list[key]['credit_type'] = 'credit'
          // console.log(key)
        }
      })(key))
      .error(function(data, status) {
        todoList._course_list[key]['sections'] = []
        // console.error('Repos error', status, data);
      })
    }
    // console.log(JSON.stringify(todoList._course_list, null, 2))
    // for(var course in todoList.course_list){
    //   course = todoList.course_list[course]
    //   console.log(course)
    //   console.log(todoList._course_list[course.id].credit)
    //   course["credit"] = todoList._course_list[course.id].credit
    //   course["description"] = todoList._course_list[course.id].description
    //   course["prereq"] = todoList._course_list[course.id].prereq
    // }
  })

  todoList.todos = [
    {text: 'learn angular', done: true},
    {text: 'build an angular app', done: false}]

    todoList.addTodo = function () {
      todoList.todos.push({text: todoList.todoText, done: false})
      todoList.todoText = ''
    }

    todoList.login = function () {
      // console.log("Login: " + todoList.isLogin)
      // console.log($(".isLogin"))
      // console.log($(".isLogin3").show())
      // if (todoList.username != "" && todoList.password != ""){
      //   console.log("Login: Pass")
      //   $scope.isLogin = true
      //   $(".isLogin3").show()
      //   $location.path("user_information/user_profile")
      // }
      // todoList.todos.push({text: todoList.todoText, done: false})
      // todoList.todoText = ''
      if (TodoListService.login(todoList.username, todoList.password)){
        todoList.isLogin = TodoListService.status_login()
        // growl.success("You have successfully <b>logged in</b>.")
        $location.path("user_information/user_profile")
      }
      else{
        growl.error("Your Username or Password is incorrect.")
      }
    }

    todoList.logout = function () {
      TodoListService.logout()
      todoList.isLogin = TodoListService.status_login()
      // growl.success("You have successfully <b>logged out</b>.")
      $location.path("login")
      // console.log($location.absUrl())
    }

    todoList.create_json = function(){
      var data = todoList.my_courses
      var json = []
      for (var i=0; i<data.length; i++){
        console.log(data[i])
        var _data = {"id":data[i].id, "section":data[i].selected_section, "creditType":todoList._course_list[data[i].id].credit_type}
        json.push(_data)
      }
      json = JSON.stringify(json, undefined, 2);
      todoList.json = json
    }

    todoList.save_to_file = function () {
      data = todoList.json
      console.log(data)
      var filename = "enrollment.json"
      if (!data) {
        console.error('No data');
        return;
      }

      if (!filename) {
        filename = 'download.json';
      }

      // if (typeof data === 'object') {
      //   data = JSON.stringify(data, undefined, 2);
      //   console.log(data)
      // }

      var blob = new Blob([data], {type: 'text/json'}),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a');

      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window,
      0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    }
    todoList.gotoSerach = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('courses');
      console.log(2222)

      // call $anchorScroll()
      $anchorScroll();
    }
    todoList.gotoSerach()
    // todoList.set_credit_type = function(){
    //   todoList._course_list[course.id]['credit_type']
    // }
    todoList.remaining = function () {
      var count = 0
      angular.forEach(todoList.todos, function (todo) {
        count += todo.done ? 0 : 1
      })
      return count
    }

    todoList.archive = function () {
      var oldTodos = todoList.todos
      todoList.todos = []
      angular.forEach(oldTodos, function (todo) {
        if (!todo.done) todoList.todos.push(todo)
      })
    }
    todoList.add_course = function (course, sec) {
      // course.selected_section = sec
      // todoList.my_courses.push(course)
      // console.log("Enroll: " + todoList.my_courses)
      if (todoList.get_total_credit() + todoList._course_list[course.id]['credit'].total <= 22){
        course.selected_section = sec
        todoList.my_courses.push(course)
        // console.log("Enroll: " + todoList.my_courses)
        growl.success(course.id + " - Added");
      }
      else{
        growl.error("Your credit is not enough.");
      }
    }
    todoList.remove_course = function (course) {
      todoList.my_courses.remove(course)
      // console.log("Enroll: " + todoList.my_courses)
    }
    todoList.get_total_credit = function () {
      var total = 0
      // console.log(typeof todoList.my_courses)
      // if (todoList.my_courses == []){
      //   return 0
      // }
      for (i = 0; i < todoList.my_courses.length; i++) {
        total += todoList._course_list[todoList.my_courses[i].id]['credit'].total
      }
      // for(var course in todoList.my_courses){
      //   if (course != 'remove'){
      //     console.log(todoList.my_courses)
      //       console.log(course + "-----")
      // total += todoList._course_list[course.id]['credit'].total
      // }
      // console.log(course + "-----"+ todoList.my_courses)
      // console.log(todoList._course_list[course.id] + "--------------")
      // }
      return total
    }

    Array.prototype.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
  })
  .service('TodoListService', function($rootScope) {
    var todoList = this
    todoList.save = function (courses) {
      todoList.courses = courses;
    }
    todoList.get = function () {
      console.log(todoList.courses)
      if (todoList.courses ==  undefined){
        todoList.courses = []
      }
      console.log(todoList.courses)
      return todoList.courses
    }
    todoList.login = function (username, password) {
      // if (todoList.isLogin ==  undefined){
      //   todoList.isLogin = bool
      // }
      // else{
      //   todoList.isLogin = bool
      // }
      // todoList.isLogin = false
      if (username != "" && password != ""){
        $rootScope.login = true
      }
      return $rootScope.login
    }
    todoList.status_login = function () {
      if ($rootScope.login ==  undefined){
        $rootScope.login = false
      }
      // todoList.isLogin =false
      return $rootScope.login
    }
    todoList.logout = function () {
      // if (todoList.isLogin ==  undefined){
      //   todoList.isLogin = false
      // }
      $rootScope.login =false
      return $rootScope.login
    }
  })
  .directive("scroll", function ($window) {
    return function(scope, element, attrs) {

      angular.element($window).bind("scroll", function() {

        if (this.pageYOffset >= 600) {
          scope.boolChangeClass = true;
          console.log('Scrolled below header.');
        } else {
          scope.boolChangeClass = false;
          console.log('Header is in view.');
        }
        scope.$apply();
      })
    };
  })
  .config(function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
  });
