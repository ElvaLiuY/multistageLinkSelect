var SelectTool = function selectTool (ele, options) {
  var _this = this
  this.selectLevel = 0
  this.selectVal = ''
  this.selectId = null
  this.selectValArr = []
  this.selectOptionList = []
  this.container = null
  this.selectButtonContainer = null
  this.optionsContainer = null
  this.ele = $(ele)
  this.options = {
    selectButton: ['选择省', '选择市', '选择区', '选择公司'],
    linkSymbol: '-',
    paramKey: {
      'id': 'id',
      'name': 'name',
      'subs': 'sub_reg',
    }
  }
  this.Init(options)
  console.log(this)
}
SelectTool.prototype.Init = function (options) {
  // console.log('init', this.options, options)
  this.optionsSetting(options)
  this.creatOrigilDom()
  this.createButtonDom()
  this.openSelectPanelEvent()
  this.closeSelectPanelEvent()
  this.bottonClickEvent()
}
SelectTool.prototype.optionsSetting = function (options) {
  if (options) {
    this.options = $.extend(true, this.options, options)
  }
}
SelectTool.prototype.creatOrigilDom = function () {
  this.container = $('<div class="m-multiple-select-container"></div>')
  this.selectButtonContainer = $('<div class="m-select-button-container">' +
    '     </div>')
  this.optionsContainer = $(
    '			<div class="m-select-options-container" >' +
    '				<input type="text" name="" class="u-select-show" >' + 
    '				<div class="m-select-options-wrap"></div>' +
    '     </div>'
  )
  this.container.append(this.selectButtonContainer)
  this.container.append(this.optionsContainer)
  this.ele.append(this.container)
}
// 初始化按钮
SelectTool.prototype.createButtonDom = function () {
  if (this.options.data && this.options.data.length) {
    this.selectButtonContainer.append('<span class="u-select-button u-active-select" selectLevel ="0">' + this.options.selectButton[0] + '</span>')
    this.selectOptionList = this.getSelectOptions()
    this.creatListDom()
  }
}
// // 选择按钮点击事件
// SelectTool.prototype.selectBtnEvent = function () {
//   var _this = this
//   $(this.selectButtonContainer).find('u-select-button').on('click', function () {
//     _this.selectLevel = $(this).index()
//     _this.selectValArr = _this.selectValArr.splice(0, _this.selectLevel)
//   })
// }
// 创建optionList结构
SelectTool.prototype.creatListDom = function () {
  let str = '<ul class="m-select-options-inner">'
  for (let j = 0; j < this.selectOptionList.length; j++) {
    str += '<li class="m-select-options-item" cityId="' + this.selectOptionList[j].id + '" name="' + this.selectOptionList[j].name + '">' + this.selectOptionList[j].name + '</li >'
  }
  str += '</ul >'
  // console.log(str)
  $(this.optionsContainer).html(str)
  this.selectItemEvent()
}
// option选择事件处理
SelectTool.prototype.selectItemEvent = function () {
  var _this = this
  $(this.optionsContainer).find('.m-select-options-item').on('click', function () {
    console.log('activeclick', $(this))
		var selectItem = {
			id: $(this).attr('cityId'),
			name: $(this).attr('name')
		}
    _this.getSelectVal(selectItem)
    _this.selectButtonContainer.find('.u-active-select').html(selectItem.name)
    _this.selectOptionList = _this.getSelectOptions(selectItem.id)
    if (_this.selectOptionList.length) {
      _this.selectLevel ++
      _this.addSelectBtn()
      _this.creatListDom()
    } else {
      _this.closeSelectPanel()
    }
		return false
	})
}
// 添加新的点击按钮
SelectTool.prototype.addSelectBtn = function (ele) {
  this.selectButtonContainer.find('.u-active-select').removeClass('u-active-select')
  var newLink = $('<span>' + this.options.linkSymbol + '</span>')
  var newBtn = $('<span class="u-select-button u-active-select" selectLevel="' + this.selectLevel + '" >' + this.options.selectButton[this.selectLevel] + '</span>')
  $(this.selectButtonContainer).append(newLink).append(newBtn)
  this.bottonClickEvent(newBtn)
}
SelectTool.prototype.getSelectVal = function (selectItem) {
  this.selectValArr = this.selectValArr.splice(0, this.selectLevel)
  this.selectValArr.push(selectItem)
  var str = ''
  for (let index = 0; index < this.selectValArr.length; index++) {
    str += this.selectValArr[index].name
  }
  this.selectVal = str
  $(this.selectButtonContainer).find('.u-select-show').val(this.selectVal)
}
SelectTool.prototype.getSelectOptions = function (pid) {
  pid = pid || '0'
  var arr = []
  this.options.data.forEach(element => {
    if (element.pid.toString() === pid.toString()) {
      arr.push(element)
    }
  })
  return arr
}
// 按钮点击处理事件
SelectTool.prototype.bottonClickEvent = function (ele) {
  var _this = this
  console.log('按钮点击', ele)
  if (ele) {
    ele.on('click', selectBtnPro)
    console.log('按钮点击ele', ele)
  } else {
    $(this.selectButtonContainer).find('.u-select-button').on('click', selectBtnPro)
  }
  function selectBtnPro () {
    console.log('dianjil')
    _this.selectLevel = $(this).attr('selectLevel')
    $(this).nextAll().remove()
    // _this.selectLevel = $(this).index()
    _this.selectValArr = _this.selectValArr.splice(0, _this.selectLevel + 1)

    if (Number(_this.selectLevel) !== 0) {
      _this.selectOptionList = _this.getSelectOptions(_this.selectValArr[_this.selectLevel - 1].id)
    } else {
      _this.selectOptionList = _this.getSelectOptions()
    }
    _this.creatListDom()
    _this.openSelectPanel()
  }
}
SelectTool.prototype.closeSelectPanelEvent = function () {
  var _this = this
  $(window).on('click', function () {
    _this.closeSelectPanel()
  })
}
SelectTool.prototype.openSelectPanelEvent = function () {
  var _this = this
  $(this.selectButtonContainer).on('click', function () {
    _this.openSelectPanel()
    return false
  })
}
SelectTool.prototype.openSelectPanel = function () {
  $(this.optionsContainer).show()
}
SelectTool.prototype.closeSelectPanel = function () {
  $(this.optionsContainer).hide()
}
