angular.module('admin').controller('jawaban', function($scope, $http, $filter, $timeout, baseURL) {
    $scope.data = {};
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var galeri_id = $filter('_uriseg')(4);
    $http.get(baseURL.url('api/galeri/') + galeri_id + '/jawaban').success(function(data) {
        $scope.data = data;
        $scope.totalItems = $scope.data.length;
        $scope.currentPage = 1;
        $scope.numPerPage = 5;
        // fungsi sorting data ASC/DESC
        $scope.paginate = function(value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.data.indexOf(value);
            return (begin <= index && index < end);
        };
        $scope.$watch('query', function(query) {
            $scope.data = data;
            $scope.data = $filter('filter')($scope.data, $scope.query);
            $scope.totalItems = $scope.data.length;
            $scope.currentPage = 1;
            $scope.numPerPage = 15;
        }, true);
    })
    $scope.delete = function(id) {
        if (confirm("Anda yakin untuk menghapus data?") === true) {
            $http.delete(baseURL.url('admin/galeri/') + galeri_id + '/jawaban/' + id).success(function(data) {
                if (data.success) {
                    $http.get(baseURL.url('api/galeri/') + galeri_id + '/jawaban').success(function(data) {
                        $scope.data = data;
                        $scope.alerts.push({type: 'success', msg: 'Data Berhasil Dihapus'});
                        $timeout(function() {
                            $scope.alerts = [];
                        }, 5000);
                    })
                }
            });
        }
    }
});
angular.module('admin').controller('jawabancreate', function($scope, $http, $filter, $timeout, baseURL) {
    $scope.data = {};
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var id = $filter('_uriseg')(4);
    $scope.data['id_soal_poll'] = id;
    $scope.galeri = {};
    $http.get(baseURL.url('api/galeridropdown')).success(function(data) {
        $scope.galeri = data;
    });
    $scope.submit = function() {
        $http.post(baseURL.url('admin/galeri/') + id + '/jawaban', $scope.data).success(function(data) {
            if (data.success) {
                window.location.replace(baseURL.url('admin/galeri/') + $scope.data['id_soal_poll'] + '/jawaban');
            }
        }).error(function(e) {
            var x;
            for (x in e) {
                $scope.alerts.push({'type': "danger", 'msg': (e[x][0])});
            }
            $timeout(function() {
                $scope.alerts = [];
            }, 5000);
        });
    }
});
angular.module('admin').controller('jawabanedit', function($scope, $http, $filter, $timeout, baseURL) {
    $scope.data = {};
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    var galeri_id = $filter('_uriseg')(4);
    var id = $filter('_uriseg')(6);
    $http.get(baseURL.url('api/jawaban/') + id).success(function(data) {
        $scope.data = data;
    })
    $scope.galeri = {};
    $http.get(baseURL.url('api/galeridropdown')).success(function(data) {
        $scope.galeri = data;
    });
    $scope.submit = function(id) {
        $http.put(baseURL.url('admin/galeri/') + galeri_id + '/jawaban/' + id, $scope.data).success(function(data) {
            if (data.success) {
                $timeout(function() {
                    window.location.replace(baseURL.url('admin/galeri/') + $scope.data['id_soal_poll'] + '/jawaban');
                }, 3000);
            }
        }).error(function(e) {
            var x;
            for (x in e) {
                $scope.alerts.push({'type': "danger", 'msg': (e[x][0])});
            }
            $timeout(function() {
                $scope.alerts = [];
            }, 5000);
        });
    }
});