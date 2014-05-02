/*globals angular,$*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("Pulldown2RefreshControl",["$scope","page","$timeout",function($scope,page,$timeout){

		$scope.items=[];

		$timeout(function () {
			$scope.items=new Array(60);
		}, 1000);

		var pullDownMessages=["Pull down to refresh","Release to refresh","Loading..."];
		var scrollOffset=$("#pRefreshViewPullDown").height();
		var pullDownThreshold=30;

		$scope.pullDownMessage=pullDownMessages[0];

		$scope.myScrollOptions={
			"pRefreshViewScroll": {
				topOffset:scrollOffset,
				onScrollMove: function () {
					if (this.y > pullDownThreshold) {
						if ($scope.pullDownMessage !== pullDownMessages[1]) {
							$scope.pullDownMessage=pullDownMessages[1];
							$scope.$apply();
						}
						this.minScrollY=0;
					}
					this.oldY=this.y;
				},
				onScrollEnd: function () {
					if (!this.scrollInit){
						$("#pRefreshViewPullDown").css("visibility","visible");
						this.scrollInit=true;
					}
					if (this.oldY > pullDownThreshold) {
						if ($scope.pullDownMessage !== pullDownMessages[2]) {
							$scope.pullDownMessage=pullDownMessages[2];
							$scope.$apply();
						}
						var that = this;
						loadNewItem().then(function () {
							that.minScrollY=-scrollOffset;
							$scope.pullDownMessage = pullDownMessages[0];
						});
					}
					this.oldY=this.y;
				}
			}
		};

		$scope.$watch("items", iScrollRefresh, true);

		var newItemId=0;
		function loadNewItem() {
			return $timeout(function () {
				for (var i=0;i<5;i++){
					$scope.items.unshift("new item " + newItemId++);
				}
			}, 2000);
		}

		function iScrollRefresh(){
			$timeout(function () {
				if ($scope.myScroll && $scope.myScroll.pRefreshViewScroll) {
					$scope.myScroll.pRefreshViewScroll.refresh();
				}
			},0);
		}
	}]);
}());
