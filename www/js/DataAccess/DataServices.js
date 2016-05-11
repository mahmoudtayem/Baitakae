/**
 * Created by mahmoud on 5/6/16.
 */
angular.module('BaitakMobileApp.DataServices', [])
.factory('DataServices', function($http,$ionicLoading) {
    return {
        GetFeatured: function(ADID){
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/GetFeatured?callback=JSON_CALLBACK&adid="+ADID+"&jsonp=yes"
            )
        },
        GetPropertyType: function(PType){
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/GetPropertyType?callback=JSON_CALLBACK&PType="+PType+"&jsonp=yes"
            )
        },
        Search: function(ObjParam){
            $ionicLoading.show();
            var url =   "http://baitak.ae/WebServices/AroundMe.asmx/Search?callback=JSON_CALLBACK&jsonp=yes"
                +"&size="+ObjParam.size  +"&bedrooms="+ObjParam.bedrooms  +"&bathrooms="+ObjParam.bathrooms  +"&price="+ObjParam.price
                +"&orderby="+ObjParam.orderby  +"&locationText="+ObjParam.locationText  +"&pageID="+ObjParam.pageID  +"&keyword="+ObjParam.keyword
                +"&adType="+ObjParam.adType  +"&Lat="+ObjParam.Lat  +"&Lng="+ObjParam.Lng  +"&PropertyType="+ObjParam.PropertyType+"&Company="+ObjParam.Company;
            console.log(url);
            return   $http.jsonp(url);
        },
        OrderByFilters: function(ObjParam){
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/GetOrderBy?callback=JSON_CALLBACK&jsonp=yes"

            )
        },
        GetAdvertismentByID: function(id)
        {
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/GetAdvertismentByID?callback=JSON_CALLBACK&jsonp=yes&adid="+id

            )
        },
        GetLatestAdvertismentByTypeID: function(id)
        {
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/Latest?callback=JSON_CALLBACK&jsonp=yes&adtype="+id

            )
        },
        GetFeaturedCompaines: function()
        {
            $ionicLoading.show();
            return   $http.jsonp(
                "http://baitak.ae/WebServices/AroundMe.asmx/FeaturedCompaines?callback=JSON_CALLBACK&jsonp=yes"

            )
        }
    }
});

