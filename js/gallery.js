	// log 大法好
	const log = function() {
		console.log.apply(console, arguments)
	}

	// 自定义选择器
	const e = function(elem) {
		return document.querySelector(elem)
	}

	const ea = function(elem) {
		return document.querySelectorAll(elem)
	}

	// 随机数生成器
	var random = function(range) {
		// 指定范围中的最大的值
		var max = Math.max(range[0], range[1])
		// 指定范围中的最小的值
		var min = Math.min(range[0], range[1])
		// 最大减去最小，得到区间
		var diff = max - min
		var number = Math.floor((Math.random() * diff + min))
		return number
	}

	// 控制按钮关联
	var iCorrelation = function(n) {
		var indicatorAll = ea('.i')
		for (var i = 0; i < indicatorAll.length; i++) {
			indicatorAll[i].className = 'i'
		}

		e('#indicator-' + n).className = 'i i-current'
	}

	// 计算左右区域的范围
	var coverage = function() {
		var range = {
			left: {
				x: [],
				y: []
			},
			right: {
				x: [],
				y: []
			}
		}
		// wrap 的宽高
		var wrap = {
			w: e('#wrap').clientWidth,
			h: e('#wrap').clientHeight,
		}
		// photo 的宽高
		var photo = { 
			w: e('.photo').clientWidth,
			h: e('.photo').clientHeight,
		}
		// 左分区
		// 最左定位范围, 最右定位范围
		range.left.x = [0 - photo.w / 2, wrap.w / 2 - photo.w / 2]
		// 最低定位范围, 最高定位范围
		range.left.y = [0 - photo.h / 2, wrap.h - photo.h / 2]
		
		// 右分区
		// 最左定位范围, 最右定位范围
		range.right.x = [wrap.w/2 + photo.w / 2, wrap.w - photo.w / 3]
		range.right.y = [0 - photo.h / 2, wrap.h - photo.h / 2]
		
		range.wrap = wrap
		range.photo = photo
		return range
	}

	// 通过编号，来决定排在中央的元素
	var rsort = function(n) {
		var photosArr = []
		// 删除所有的 current class
		var photos = ea('.photo')
		for (var i = 0; i < photos.length; i++) {
			photos[i].classList.remove('photo-current')
			photosArr.push(photos[i])
		}
		var photoCurrent = e('#photo-' + n)
		photoCurrent.className = 'photo photo_front photo-current'
		photoCurrent.style = ''
		photosArr.splice(n, 1)
		// 把海报分为左，右两个部分
		var photosLeft = photosArr.splice(0, Math.ceil(photos.length / 2))
		var photosRight = photosArr

		var ranges = coverage()
		for(i in photosLeft) {	
			photosLeft[i].style.left = random(ranges.left.x) + 'px'
			photosLeft[i].style.top = random(ranges.left.y) + 'px'
			photosLeft[i].style.transform = 'rotate(' + random([-150, 150]) + 'deg)'
		}		
		for(i in photosRight) {	
			photosRight[i].style.left = random(ranges.right.x) + 'px'
			photosRight[i].style.top = random(ranges.right.y) + 'px'
			photosRight[i].style.transform = 'rotate(' + random([-150, 150]) + 'deg)'
		}

		iCorrelation(n)
	}

	// chun
	// var changePhoto = function(n, style) {
	// 	log('n', n)
	// 	var oldPhoto = e('.photo-current')
	// 	log(oldPhoto)
	// 	oldPhoto.setAttribute('style', style)
	// 	// 删除所有的 current class
	// 	var photos = ea('.photo')
	// 	for (var i = 0; i < photos.length; i++) {
	// 		photos[i].classList.remove('photo-current')
	// 	}
	// 	var photoCurrent = e('#photo-' + n)
	// 	photoCurrent.className = 'photo photo_front photo-current'
	// 	photoCurrent.style = ''

	// 	iCorrelation(n)
	// }

	var addPhotos = function() {
		var templete = e('#wrap').innerHTML
		var html = []
		var nav = []
		// 把 div 模板里的动态数据替换，生成新的 div 模板
		// 把新的 div 模板填进 html 数组
		for(index in data) {
			var div = templete.replace('{{index}}', 'photo-' + index)
			.replace('{{caption}}', data[index].todo)
			.replace('{{image}}', 'images/' + data[index].picture)		
			html.push(div)

			var indicatorHtml = "<span id=indicator-" + index + " class=i>&nbsp;</span>"
			nav.push(indicatorHtml)
		}
		var navHtml = '<div class=nav>' + nav.join('') + '</div>'
		html.push(navHtml)

		// 把 html 里的所有 div 模板覆盖式写入 html
		e('#wrap').innerHTML = html.join('')
		// 指定范围
		var range = [0, data.length]
		// 传范围区间，得到随机数(将要显示的图片编号)
		var number = random(range)
		rsort(number)
	}

	// 翻面控制
	var turnPhoto = function(elem) {
		// 获取到被点击元素的所有 class
		var cls = elem.className
		if(/photo_front/.test(cls)) {
			elem.classList.remove('photo_front')
			elem.classList.add('photo_back')
		} else {
			elem.classList.remove('photo_back')
			elem.classList.add('photo_front')
		}
	}

	// 绑定按钮
	var bindEvent = function() {
		// 指示器绑定
		var nav = e('.nav')
		nav.addEventListener('click', function(){
			var target = event.target
			if(target.classList.contains('i')) {
				var number = target.getAttribute('id').slice(10)
				var oldPhoto = e('#photo-' + number)
				var style = oldPhoto.getAttribute('style')
				rsort(number)
			}
		})

		// 点击图片切换
		var photo = ea('.photo')
		for (let i = 0; i < photo.length; i++) {
			photo[i].onclick = function() {
				var target = event.target
				if(!target.classList.contains('photo')) {
					// 向上查找父元素
					var parent = target.closest('.photo')
					log(parent)
					var number = parent.getAttribute('id').slice(6)
					var style = parent.getAttribute('style')
					rsort(number)
				}
			}
		}
	}

	addPhotos()
	bindEvent()