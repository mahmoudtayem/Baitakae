angular.module('BaitakMobileApp.controllers', [])

.directive('googleplace', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, model) {
            var options = {
                types: [], language: "en",
                componentRestrictions: { country: "ae" }
            };
            scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                var geoComponents = scope.gPlace.getPlace();

                scope.$apply(function() {
                    scope.SearchData.latitude = geoComponents.geometry.location.lat();
                    scope.SearchData.longitude = geoComponents.geometry.location.lng();

                    model.$setViewValue(element.val());
                });
            });
        }
    };
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
    })
.controller('SearchResultCtrl', function($http,$scope, $stateParams,DataServices,$ionicPopover,$ionicLoading,$ionicSlideBoxDelegate) {


        $scope.GenratePages = function (totalPages)
        {
            $scope.Data.Pages = [];
            for(i = 0; i <totalPages ; i++)
            {
                $scope.Data.Pages.push({PageID : i, PageText : (i+1)});
            }
        }

        $scope.OrderResult = function(OrderBy,OrderByText)
        {
            $scope.Data.Query.orderby = OrderBy;
            DataServices.Search($scope.Data.Query).then(function(data)
            {

                $ionicLoading.hide();
                $scope.Data.Result = data.data.Data;
                $scope.Data.CurrentFilter = OrderByText;
                $scope.popover.hide();

            });
        }

        $scope.GoToPage = function(Page)
        {
            $scope.Data.Query.pageID = Page;
            DataServices.Search($scope.Data.Query).then(function(data)
            {

                $ionicLoading.hide();
                $scope.Data.Result = data.data.Data;
                $scope.Data.CurrentPage = Page;
                $scope.popoverPager.hide();

            });
        }

        $scope.Data = {};
        $scope.Data.CurrentPage = 1;
        $scope.Data.CurrentFilter = "No Filter";

        $scope.Data.Query= JSON.parse($stateParams.QueryStringObj);


        DataServices.OrderByFilters().then(function(data)
        {
            $ionicLoading.hide();
            $scope.Data.OrderBy = data.data;
            $ionicPopover.fromTemplateUrl('templates/OrderBy.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });
        });



        DataServices.Search($scope.Data.Query).then(function(data)
        {

            $ionicLoading.hide();
            $scope.Data.Result = data.data.Data;
            $scope.GenratePages(data.data.TotalNumberOfPages);
            $ionicPopover.fromTemplateUrl('templates/Pager.html', {
                scope: $scope
            }).then(function(popoverPager) {
                $scope.popoverPager = popoverPager;
            });

            $scope.Data.TotalNumberOfPages = data.data.TotalNumberOfPages;


        });




    })
.controller('HomeCtrl', function($http,$scope,$state, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {


        $scope.Featured = {};
        $scope.SearchData = {};
        DataServices.GetFeatured(0).then(function(data)
        {
            $scope.Featured.Data = data.data.Data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });

        DataServices.GetPropertyType(0).then(function(data)
        {
            $scope.Featured.PType = data.data;
            $ionicLoading.hide();

        });


        $scope.Search = function()
        {
            if( $scope.SearchData.Location  == undefined || $scope.SearchData.Location == "undefined")
            {
                alert("Please select a valid location");
                return;
            }
            var params = {

                'size': $scope.SearchData.Size  != undefined && $scope.SearchData.Size != "undefined"?$scope.SearchData.Size :"0 - 99999",
                'bedrooms': $scope.SearchData.Bedrooms  != undefined && $scope.SearchData.Bedrooms != "undefined"?$scope.SearchData.Bedrooms :"0 - 100",
                'bathrooms': $scope.SearchData.Bathrooms  != undefined && $scope.SearchData.Bathrooms != "undefined"?$scope.SearchData.Bathrooms :"0 - 100",
                'price': $scope.SearchData.Price  != undefined && $scope.SearchData.Price != "undefined"?$scope.SearchData.Price :"0 - 9999999",
                'orderby': 1 ,
                'locationText': $scope.SearchData.Location,
                'pageID': 1,
                'keyword': $scope.SearchData.Keyword != undefined && $scope.SearchData.Keyword != "undefined"?$scope.SearchData.Keyword :"" ,
                'adType': $scope.SearchData.ADType  != undefined && $scope.SearchData.ADType != "undefined"?$scope.SearchData.ADType :1,
                'Lat': $scope.SearchData.latitude  != undefined && $scope.SearchData.latitude != "undefined"?$scope.SearchData.latitude :"25",
                'Lng': $scope.SearchData.longitude  != undefined && $scope.SearchData.longitude != "undefined"?$scope.SearchData.longitude :"55",
                'PropertyType': $scope.SearchData.PropertyType  != undefined && $scope.SearchData.PropertyType != "undefined"?$scope.SearchData.PropertyType :"All",
                'Company': ""
            };
            var ObjParam = params;

            $state.go('app.SearchResult', {QueryStringObj: JSON.stringify(params)}, {reload: true});


        }




})
.controller('SearchCtrl', function($http,$scope, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {


        $scope.Featured = {};
        $scope.SearchData = {};
        DataServices.GetFeatured(0).then(function(data)
        {
            $scope.Featured.Data = data.data.Data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });

        DataServices.GetPropertyType(0).then(function(data)
        {
            $scope.Featured.PType = data.data;
            $ionicLoading.hide();

        });


        $scope.Search = function()
        {
            var params = {

                'size': $scope.SearchData.Size ,
                'bedrooms': $scope.SearchData.Bedrooms ,
                'bathrooms': $scope.SearchData.Bathrooms ,
                'price': $scope.SearchData.Price ,
                'orderby': 1 ,
                'locationText': $scope.SearchData.Location ,
                'pageID': 1,
                'keyword': $scope.SearchData.Keyword ,
                'adType': $scope.SearchData.ADType  ,
                'Lat': $scope.SearchData.latitude ,
                'Lng': $scope.SearchData.longitude ,
                'PropertyType': $scope.SearchData.PropertyType ,
                'Company': "None"
            };


            alert(JSON.stringify(params));




        }




    });

