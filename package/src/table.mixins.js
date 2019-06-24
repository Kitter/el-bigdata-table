export default {
  props: {
    rowHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      scrollTop: 0,
      innerTop: 0,
      start: 0,
      preEnd: 0,
      end: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.isUseVirtual) {
        const tableBodyWrapper = this.$el.querySelector('.el-table__body-wrapper')
        tableBodyWrapper.addEventListener('scroll', this.handleScroll)
        tableBodyWrapper.addEventListener('DOMMouseScroll', this.handleScroll)
      }
    })
  },
  activated () {
    if (this.isUseVirtual) {
      this.computeScrollToRow(0)
    }
  },
  methods: {
    computeScrollToRow (offset) {
      const startIndex = parseInt(offset / this.rowHeight)

      const {start, end} = this.getVisibleRange(startIndex)

      this.start = start
      this.end = end
      this.innerTop = this.start * this.rowHeight
    },

    getVisibleRange (ExpectStart) {
      const visibleCount = Math.ceil(this.tableHeight / this.rowHeight)

      return {
        start: ExpectStart,
        end: ExpectStart + visibleCount
      }
    },
    //  滚动条拖动
    handleScroll (e) {
      const ele = e.srcElement || e.target
      let { scrollTop } = ele
      const bodyScrollHeight = this.$el.querySelector('.el-table__body').scrollHeight

      // 解决 滚动时 行hover高亮的问题
      this.store.states.hoverRow = null

      if (this.virtualBodyHeight < scrollTop + bodyScrollHeight) {
        scrollTop = this.virtualBodyHeight - bodyScrollHeight
      }

      this.scrollTop = scrollTop
    }
  },
  computed: {
    virtualBodyHeight () {
      return this.data.length * this.rowHeight
    },
    isUseVirtual () {
      return 'useVirtual' in this.$attrs && this.$attrs.useVirtual !== false
    }
  },
  watch: {
    scrollTop: {
      handler (top) {
        this.computeScrollToRow(top)
      }
    },
    data: {
      immediate: true,
      handler () {
        if (this.isUseVirtual) {
          setTimeout(() => {
            this.tableHeight = this.$el.clientHeight
            this.computeScrollToRow(this.scrollTop)
            this.$nextTick(this.doLayout)
          }, 0)
        }
      }
    }
  }
}
