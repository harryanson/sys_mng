angular.module('app')
    .directive('nodeTree', function () {
        return {
            template: '<node ng-repeat="node in tree"></node>',
            replace: true,
            restrict: 'E',
            scope: {
                tree: '=children'
            }
        };
    }).directive('node', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            template:'<li><span ng-click="toggleVisibility(node)" ng-show="node.childrenVisibility && node.children.length"> <i class="fa fa-plus" aria-hidden="true"></i></span>'+
            '<span ng-click="toggleVisibility(node)"  ng-show="!node.childrenVisibility && node.children.length"><i class="fa fa-minus" aria-hidden="true"></i></span>'+
            '<span ng-show="!node.childrenVisibility && node.children.length==0"></span>'+
            '<input ng-click="checkNode(node)"  ng-disabled="node.disabled" type="checkbox" ng-checked="node.checked">'+
            '<span>{{ $index + 1 }}. {{ node.text }}</span></li>',
            compile: function (element, tAttr) {
                var contents = '<ul class="tree" ng-if="!node.childrenVisibility"><node-tree children="node.children"></node-tree></ul>';//element.contents().remove();
                var compiledContents;
                return function (scope, element, iAttr) {
                    if (!compiledContents) {
                        compiledContents = $compile(contents);
                    }
                    compiledContents(scope, function (clone, scope) {
                        element.append(clone);
                    });
                };
            },
/*            link: function (scope, element) {
                /!*
                 * Here we are checking that if current node has children then compiling/rendering children.
                 * *!/
                if (scope.node && scope.node.children && scope.node.children.length > 0) {
                    scope.node.childrenVisibility = true;
                    var childNode = $compile('<ul class="tree" ng-if="!node.childrenVisibility"><node-tree children="node.children"></node-tree></ul>')(scope);
                    element.append(childNode);
                } else {
                    scope.node.childrenVisibility = false;
                }
            },*/
            controller: ["$scope", function ($scope) {
                // This function is for just toggle the visibility of children
                $scope.toggleVisibility = function (node) {
                    if (node.children) {
                        node.childrenVisibility = !node.childrenVisibility;
                    }
                };
                // Here We are marking check/un-check all the nodes.
                $scope.checkNode = function (node) {
                    node.checked = !node.checked;
                    console.log(node)
                    function checkChildren(c) {
                        angular.forEach(c.children, function (c) {
                            c.checked = node.checked;
                            checkChildren(c);
                        });
                    }
                    function checkParent(c) {
                        angular.forEach(c.children, function (c) {
                            c.checked = node.checked;
                            checkParent(c);
                        });
                    }
                    checkParent(node);
                    checkChildren(node);
                };
            }]
        };
    }]);
