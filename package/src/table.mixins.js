export default {
  props: {
    rowHeight: {
      type: Number,
      default: 50
    },
    excessRows: {
      type: Number,
      default: 5
    },
    useVirtual: Boolean
  },
  data () {
    return {
      scrollTop: 0,
      scrollLeft: 0,
      columnsPosotion: {},
      tableBodyWrapperWidth: 0,
      innerTop: 0,
      start: 0,
      end: 0,
      columnStart: 0,
      columnEnd: 0
    }
  },
  computed: {
    visibleCount () {
      return Math.ceil(this.height / this.rowHeight)
    },

    virtualBodyHeight () {
      return this.store.states.data.length * this.rowHeight
    }
  },
  watch: {
    scrollTop: {
      immediate: true,
      handler (top) {
        this.computeScrollToRow(top)
      }
    },

    scrollLeft (left) {
      this.computeScrollToColumn(left)
    },

    columns () {
      let position = 0

      this.columnsPosotion = this.columns.map(({ realWidth = 0, width = 0, minWidth = 0 }, columnIdx) => {
        return [position, position += Math.max(realWidth, width, minWidth)]
      })
    },

    virtualBodyHeight () {
      setTimeout(this.doLayout, 10)
    },

    height () {
      this.computeScrollToRow(this.scrollTop)
    },

    tableBodyWrapperWidth () {
      this.computeScrollToColumn(this.scrollLeft)
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.useVirtual) {
        const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')
        this.tableBodyWrapperWidth = tableBodyWrapper.clientWidth

        this.bindEvent('bind')
      }
    })
  },
  activated () {
    if (this.useVirtual) {
      this.computeScrollToRow(0)
      this.bindEvent('bind')
    }
  },
  deactivated () {
    if (this.useVirtual) {
      this.bindEvent('unbind')
    }
  },
  beforeDestroy () {
    if (this.useVirtual) {
      this.bindEvent('unbind')
    }
  },
  methods: {
    bindEvent (action) {
      const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')

      if (!this.binded && action === 'bind') {
        tableBodyWrapper.addEventListener('scroll', this.handleScroll)
        tableBodyWrapper.addEventListener('DOMMouseScroll', this.handleScroll)
        window.addEventListener('resize', this.recalculate)
        this.binded = true
      } else if (this.binded && action === 'unbind') {
        tableBodyWrapper.removeEventListener('scroll', this.handleScroll)
        tableBodyWrapper.removeEventListener('DOMMouseScroll', this.handleScroll)
        window.removeEventListener('resize', this.recalculate)
        this.binded = false
      }
    },

    recalculate () {
      const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')

      this.tableBodyWrapperWidth = tableBodyWrapper.clientWidth
    },

    computeScrollToColumn (scrollLeft) {
      let start = 0, end = 0
      let visibleWidth = 0

      for (let i = 0;i < this.columnsPosotion.length; i++) {
        const [left, right] = this.columnsPosotion[i]

        if (scrollLeft >= left && scrollLeft < right) {
          start = i
          visibleWidth = right - scrollLeft
        } else if (left > scrollLeft) {
          visibleWidth += (right - left)
        }

        if (visibleWidth + this.layout.gutterWidth >= this.tableBodyWrapperWidth) {
          end = i
          break
        }
      }

      console.log(this.columnsPosotion, this.columnStart, this.columnEnd, this.tableBodyWrapperWidth)
      this.columnStart = start
      this.columnEnd = end
    },

    computeScrollToRow (scrollTop) {
      let startIndex = parseInt(scrollTop / this.rowHeight)

      const { start, end } = this.getVisibleRange(startIndex)

      this.start = start
      this.end = end
      this.innerTop = this.start * this.rowHeight
    },

    getVisibleRange (expectStart) {
      const start = expectStart - this.excessRows

      return {
        start: start >= 0 ? start : 0,
        end: expectStart + this.visibleCount + this.excessRows
      }
    },

    handleScroll (e) {
      const ele = e.srcElement || e.target
      let { scrollTop, scrollLeft } = ele
      const bodyScrollHeight = this.visibleCount * this.rowHeight

      // 解决 滚动时 行hover高亮的问题
      this.store.states.hoverRow = null

      if (this.virtualBodyHeight < scrollTop + bodyScrollHeight) {
        scrollTop = this.virtualBodyHeight - bodyScrollHeight
      }

      if (parseInt(this.scrollTop) !== parseInt(scrollTop)) {
        this.scrollTop = scrollTop
      }

      if (parseInt(this.scrollLeft) !== parseInt(scrollLeft)) {
        this.scrollLeft = scrollLeft
      }
    }
  }
}
