module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = render;
function render(h) {
  var _this = this;

  var columnsHidden = this.columns.map(function (column, index) {
    return _this.isColumnHidden(index);
  });
  var rows = this.data;
  if (this.store.states.lazy && Object.keys(this.store.states.lazyTreeNodeMap).length) {
    rows = rows.reduce(function (prev, item) {
      prev.push(item);
      var rowKey = _this.store.table.getRowKey(item);
      var parent = _this.store.states.treeData[rowKey];
      if (parent && parent.children && parent.hasChildren) {
        var tmp = [];
        var traverse = function traverse(children) {
          if (!children) return;
          children.forEach(function (key) {
            tmp.push(_this.store.states.lazyTreeNodeMap[key]);
            if (_this.store.states.treeData[key]) {
              traverse(_this.store.states.treeData[key].children);
            }
          });
        };
        traverse(parent.children);
        prev = prev.concat(tmp);
      }
      return prev;
    }, []);
  }
  return h(
    'div',
    {
      style: [{ height: this.table.virtualBodyHeight + 'px' }],
      'class': ['el-table__virtual-wrapper', { 'el-table--fixed__virtual-wrapper': this.fixed }],
      directives: [{
        name: 'mousewheel',
        value: this.table.handleFixedMousewheel
      }]
    },
    [h(
      'div',
      { style: [{ transform: 'translateY(' + this.table.innerTop + 'px)' }] },
      [h(
        'table',
        {
          'class': 'el-table__body',
          attrs: { cellspacing: '0',
            cellpadding: '0',
            border: '0' }
        },
        [h('colgroup', [this._l(this.columns, function (column, cellIndex) {
          return columnsHidden[cellIndex] && _this.fixed ? '' : h('col', {
            attrs: { name: column.id }
          });
        })]), h('tbody', [this._l(rows, function (row, index) {
          var $index = _this.getIndex(index);
          var rowKey = _this.table.rowKey ? _this.getKeyOfRow(row, $index) : $index;
          var treeNode = _this.treeData && _this.treeData[rowKey];
          var rowClasses = _this.getRowClass(row, $index);
          if (treeNode) {
            rowClasses.push('el-table__row--level-' + treeNode.level);
          }
          var tr = h(
            'tr',
            {
              directives: [{
                name: 'show',
                value: treeNode ? treeNode.display : true
              }],

              style: _this.rowStyle ? _this.getRowStyle(row, $index) : null,
              key: rowKey,
              on: {
                'dblclick': function dblclick($event) {
                  return _this.handleDoubleClick($event, row);
                },
                'click': function click($event) {
                  return _this.handleClick($event, row);
                },
                'contextmenu': function contextmenu($event) {
                  return _this.handleContextMenu($event, row);
                },
                'mouseenter': function mouseenter(_) {
                  return _this.handleMouseEnter($index);
                },
                'mouseleave': function mouseleave(_) {
                  return _this.handleMouseLeave();
                }
              },

              'class': rowClasses },
            [_this._l(_this.columns, function (column, cellIndex) {
              var _getSpan = _this.getSpan(row, column, $index, cellIndex),
                  rowspan = _getSpan.rowspan,
                  colspan = _getSpan.colspan;

              if (!rowspan || !colspan || columnsHidden[cellIndex] && _this.fixed) {
                return '';
              } else {
                var columnData = Object.assign({}, column);
                if (colspan !== 1) {
                  columnData.realWidth = columnData.realWidth * colspan;
                }
                var data = {
                  store: _this.store,
                  _self: _this.context || _this.table.$vnode.context,
                  column: columnData,
                  row: row,
                  $index: $index
                };
                if (cellIndex === _this.firstDefaultColumnIndex && treeNode) {
                  data.treeNode = {
                    hasChildren: treeNode.hasChildren || treeNode.children && treeNode.children.length,
                    expanded: treeNode.expanded,
                    indent: treeNode.level * _this.treeIndent,
                    level: treeNode.level,
                    loaded: treeNode.loaded,
                    rowKey: rowKey
                  };
                }
                return h(
                  'td',
                  {
                    style: [{ height: _this.table.rowHeight + 'px' }, _this.getCellStyle($index, cellIndex, row, column)],
                    'class': _this.getCellClass($index, cellIndex, row, column),
                    attrs: { rowspan: rowspan,
                      colspan: colspan
                    },
                    on: {
                      'mouseenter': function mouseenter($event) {
                        return _this.handleCellMouseEnter($event, row);
                      },
                      'mouseleave': _this.handleCellMouseLeave
                    }
                  },
                  [column.renderCell.call(_this._renderProxy, h, data, columnsHidden[cellIndex])]
                );
              }
            })]
          );
          if (_this.hasExpandColumn && _this.store.isRowExpanded(row)) {
            return [tr, h('tr', [h(
              'td',
              {
                attrs: { colspan: _this.columns.length },
                'class': 'el-table__expanded-cell' },
              [_this.table.renderExpanded ? _this.table.renderExpanded(h, { row: row, $index: $index, store: _this.store }) : '']
            )])];
          } else {
            return tr;
          }
        }).concat(h('el-tooltip', {
          attrs: { effect: this.table.tooltipEffect, placement: 'top', content: this.tooltipContent },
          ref: 'tooltip' }))])]
      )]
    )]
  );
}

/***/ })
/******/ ]);