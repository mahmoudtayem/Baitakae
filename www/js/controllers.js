angular.module('BaitakMobileApp.controllers', [])

.service('LocationService', function($q){

        var detailsService = new google.maps.places.PlacesService(document.createElement("input"));
        return {
            searchAddress: function(input) {
                var deferred = $q.defer();
                var options = {
                    types: [], language: "en",
                    componentRestrictions: { country: "ae" }
                };
                var autocompleteService = new google.maps.places.AutocompleteService(input,options);
                autocompleteService.getPlacePredictions({
                    componentRestrictions: { country: "ae" },
                    input: input
                }, function(result, status) {
                    if(status == google.maps.places.PlacesServiceStatus.OK){
                        console.log(status);
                        deferred.resolve(result);
                    }else{
                        deferred.reject(status)
                    }
                });

                return deferred.promise;
            },
            getDetails: function(placeId) {
                var deferred = $q.defer();
                detailsService.getDetails({placeId: placeId}, function(result) {
                    deferred.resolve(result);
                });
                return deferred.promise;
            }
        };
    })
.directive('locationSuggestion', function($ionicModal, LocationService){
        return {
            restrict: 'A',
            scope: {
                location: '=',
                Location: '='
            },
            link: function($scope , element){
                console.log('locationSuggestion started!');
                $scope.search = {};
                $scope.search.suggestions = [];
                $scope.search.query = "";
                $ionicModal.fromTemplateUrl('templates/LocationAutoComplete.html', {
                    scope: $scope,
                    focusFirstInput: true
                }).then(function(modal) {

                    $scope.LocationModal = modal;
                });
                element[0].addEventListener('focus', function(event) {
                    $scope.open();
                });
                $scope.$watch('search.query', function(newValue) {
                    if (newValue) {
                        LocationService.searchAddress(newValue).then(function(result) {
                            $scope.search.error = null;
                            $scope.search.suggestions = result;
                        }, function(status){
                            $scope.search.error = "There was an error :( " + status;
                        });
                    };
                    $scope.open = function() {
                        $scope.LocationModal.show();
                    };
                    $scope.close = function() {
                        $scope.LocationModal.hide();
                    };
                    $scope.choosePlace = function(place) {
                        LocationService.getDetails(place.place_id).then(function(location) {
                            $scope.location = location;
                            $scope.$root.Location = location;
                            $scope.close();
                        });
                    };
                });
            }
        }
    })


.directive('onError', function() {
    return {
        restrict:'A',
        link: function(scope, element, attr) {
            element.on('error', function() {
                document.getElementById(attr.onError).remove();
                console.log(attr.onError);
                scope.UpdateSlider();

            })
        }
    }
})
.directive('onImageError', function() {
        return {
            restrict:'A',
            link: function(scope, element, attr) {
                element.on('error', function() {
                    element.attr('src', "http://image.baitak.ae//remote.jpg.ashx?format=jpeg&quality=80&width=131.111111111111&height=85.1851851851852&bgcolor=white&404=default&watermark=baitak&urlb64=aHR0cHM6Ly9kM3NlcXFpZzYwZjhmNC5jbG91ZGZyb250Lm5ldC9pbWFnZXMvdXNlcl9pbWFnZXMvMjAxNi8wNS8wNC82MDU5MDgwMV9DUF90aHVtYm5haWwuanBlZw&hmac=q-6P4VO3Ntc");
                })
            }
        }
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
.controller('HomeCtrl', function($http,$scope,$state, $rootScope , $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {

        $rootScope .Location = {};
        $scope.location = {};
        $scope.SearchData = {};

        $scope.Featured = {};

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


            if( $rootScope.Location  == undefined || $rootScope.Location == "undefined")
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
                'locationText': $rootScope.Location.formatted_address,
                'pageID': 0,
                'keyword': $scope.SearchData.Keyword != undefined && $scope.SearchData.Keyword != "undefined"?$scope.SearchData.Keyword :"" ,
                'adType': $scope.SearchData.ADType  != undefined && $scope.SearchData.ADType != "undefined"?$scope.SearchData.ADType :1,
                'Lat': $rootScope.Location.geometry.location != undefined && $rootScope.Location.geometry.location != "undefined"? $rootScope.Location.geometry.location.lat() :"25",
                'Lng': $rootScope.Location.geometry.location   != undefined && $rootScope.Location.geometry.location  != "undefined"? $rootScope.Location.geometry.location.lng() :"55",
                'PropertyType': $scope.SearchData.PropertyType  != undefined && $scope.SearchData.PropertyType != "undefined"?$scope.SearchData.PropertyType :"All",
                'Company': "None"
            };
            var ObjParam = params;

            $state.go('app.SearchResult', {QueryStringObj: JSON.stringify(params)}, {reload: true});


        }




})
.controller('FeaturedAdvertismentsCtrl', function($http,$scope,$state, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {


        $scope.Featured = {};

        DataServices.GetFeatured(0).then(function(data)
        {
            $scope.Featured.Data = data.data.Data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });








    })
.controller('LatestAdvertismentsCtrl', function($http,$scope,$state, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {
        $scope.Featured = {};

        $scope.SelectType = function(adType)
        {
            DataServices.GetLatestAdvertismentByTypeID(adType).then(function(data)
            {
                $scope.Featured.Data = data.data.Data;
                $ionicSlideBoxDelegate.update();
                $ionicLoading.hide();
            });

        }
        DataServices.GetLatestAdvertismentByTypeID(1).then(function(data)
        {
            $scope.Featured.Data = data.data.Data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });

    })
.controller('FeaturedCompainesCtrl', function($http,$scope,$state, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {
        $scope.Featured = {};

        $scope.Search = function(company)
        {

            var params = {

                'size': "",
                'bedrooms': "",
                'bathrooms':"",
                'price': "",
                'orderby': 1 ,
                'locationText': "",
                'pageID': 0,
                'keyword': "",
                'adType': "",
                'Lat': "",
                'Lng': "",
                'PropertyType': "",

                'Company':company
            };


            $state.go('app.SearchResult', {QueryStringObj: JSON.stringify(params)}, {reload: true});


        }
        DataServices.GetFeaturedCompaines(1).then(function(data)
        {
            $scope.Data = data.data;
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });

    })
.controller('OfferDetailsCtrl', function($http,$sce,$scope,$ionicModal, $stateParams,$ionicLoading,DataServices,$ionicSlideBoxDelegate) {


        $scope.UpdateSlider = function()
        {
            $ionicSlideBoxDelegate.update();
        }

        $ionicModal.fromTemplateUrl('templates/AminitesPopup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.AminitesPopup = modal;
        });

        $ionicModal.fromTemplateUrl('templates/ImagePopup.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.OpenAminites = function()
        {
            $scope.AminitesPopup.show();
        }

        $scope.openModal = function(index) {
            $scope.OpenImage = $scope.Data.Data.Images[index];
            $scope.modal.show();
        };
        $scope.closeAminitesPopupModal = function() {
            $scope.AminitesPopup.hide();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hide', function() {
            // Execute action
        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
            // Execute action
        });
        $scope.$on('modal.shown', function() {
            console.log('Modal is shown!');
        });

        $scope.Data = {};
        $scope.SearchData = {};
        DataServices.GetAdvertismentByID($stateParams.id).then(function(data)
        {
            $scope.Data.Data = data.data;
            $ionicSlideBoxDelegate.update();

            $scope.Data.Data.Description = $sce.trustAsHtml($scope.Data.Data.Description);
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

        }


    })
;

