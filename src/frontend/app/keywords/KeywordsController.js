angular.module('app').controller('KeywordsController', function($scope, RepositoryFactory, resolveEntity) {
  $scope.resolveEntity = resolveEntity;

  var KeywordCategoriesRepository = new RepositoryFactory({
    endpoint: 'keywords/categories',
    retrieveItems: function(data) {
      return data._items;
    }
  });

  var KeywordsRepository = new RepositoryFactory({
    endpoint: 'keywords',
    retrieveItems: function(data) {
      return data._items;
    }
  });

  KeywordCategoriesRepository.readAll().then(function(keywordCategories) {
    $scope.keywordCategories = keywordCategories;
    KeywordsRepository.readAll().then(function(keywords) {
        $scope.keywords = keywords;
    });
  });

  $scope.keywordsGridOptions = {
    data: 'keywords', // This makes the grid use the data in $scope.keywords
    enableCellSelection: false, // breaks edit of cells with select element if true
    enableCellEdit: true,
    keepLastSelected: false,
    enableRowSelection: false,
    multiSelect: false,
    enableSorting: true,
    enableColumnResize: true,
    enableColumnReordering: true,
    showFilter: false,
    rowHeight: '40',
    columnDefs: [
    {
      field: 'id',
      displayName: 'ID',
      enableCellEdit: false,
      width: '80px'
    },
    {
      field: 'value',
      displayName: 'Value'
    },
    {
      /* The keyword category field does not use the build-in cell template,\
      but our own */
      field: 'keywordCategoryID',
      displayName: 'Category',
      cellTemplate: 'app/keywords/partials/keywordCategoryGridCell.html',
      editableCellTemplate: 'app/keywords/partials/keywordCategoryGridCellEditor.html'
    },
    {
      /* Same goes for the operations column */
      field: '',
      displayName: 'Operations',
      cellTemplate: 'app/keywords/partials/operationsGridCell.html',
      enableCellEdit: false,
      sortable: false
    }
  ]};


    /* == Frontend Operations == */
  /* These functions are called when the frontend is operated, e.g., if a butt\
  on is clicked */
  $scope.createKeyword = function(newKeyword) {
    $scope.$broadcast('ngGridEventEndCellEdit');
    if (newKeyword.value.length > 0) {
      KeywordsRepository.createOne(newKeyword).then(function () {
        KeywordsRepository.readAll().then(function (keywords) {
          $scope.keywords = keywords;
        });
      });
    }
  };

  $scope.updateKeyword = function(keyword) {
    $scope.$broadcast('ngGridEventEndCellEdit');
    KeywordsRepository.updateOne(keyword);
  };

  $scope.deleteKeyword = function(keyword) {
    $scope.$broadcast('ngGridEventEndCellEdit');
    KeywordsRepository.deleteOne(keyword).then(function() {
      KeywordsRepository.readAll().then(function(keywords) {
        $scope.keywords = keywords;
      });
    });
  };

  /* These are here to make the grid behave cleanly in regards to the keyword \
category select */
  $scope.stopEditingKeywordCategory = function() {
    $scope.$broadcast('ngGridEventEndCellEdit');
  };

  $scope.$on('ngGridEventRows', function(newRows) {
    $scope.$broadcast('ngGridEventEndCellEdit');
  });

});
