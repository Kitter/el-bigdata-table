import ElementUi, {
  Table
} from 'element-ui'

import Mousewheel from 'element-ui/lib/directives/mousewheel'

import VirtualTableBodyRender from './virtual-table-body-render.js'

const ElTableBody = Table.components.TableBody
const ElementUiVersion = +ElementUi.version.split('.').slice(0, 2).join('.')

ElTableBody.directives = {
  Mousewheel
}

const oldDataComputed = ElTableBody.computed.data
ElTableBody.computed.data = function () {
  const { table } = this

  if (table.isUseVirtual) {
    return table.data.slice(table.start, table.end)
  } else {
    return oldDataComputed.call(this)
  }
}

const oldHoverRowHandler = ElTableBody.watch && ElTableBody.watch['store.states.hoverRow']
if (oldHoverRowHandler) {
  ElTableBody.watch['store.states.hoverRow'] = function (newVal, oldVal) {
    if (!this.table.isUseVirtual) {
      oldHoverRowHandler && oldHoverRowHandler.call(this, newVal, oldVal)
    }
  }
}

ElTableBody.methods.getIndex = function (index) {
  return this.table.start + index;
}

const oldGetRowClassHandler = ElTableBody.methods.getRowClass
ElTableBody.methods.getRowClass  = function (row, rowIndex) {
  let classes = oldGetRowClassHandler.call(this, row, rowIndex)

  if (this.table.isUseVirtual && rowIndex === this.store.states.hoverRow && this.table.rightFixedColumns.length && this.table.fixedColumns.length) {
    // 兼容element-ui低版本
    if (ElementUiVersion >= 2.8 && Object.prototype.toString.call(classes) === '[object Array]') {
      classes.push('hover-row')
    } else if (typeof classes === 'string') {
      classes += ' hover-row'
    }
  }

  return classes
}

const oldRender = ElTableBody.render
ElTableBody.render = function (h) {
  if (this.table.isUseVirtual) {
    return VirtualTableBodyRender.call(this, h)
  } else {
    return oldRender.call(this, h)
  }
}
