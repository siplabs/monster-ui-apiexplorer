define(function(require){
	var s = document.createElement("script");
	s.src = "apps/apiexplorer/lib/highlight.pack.js";
	s.async = false;
	document.head.insertBefore(s, document.head.firstChild);

	var $ = require('jquery'),
		monster = require('monster'),
		methodsGenerator = {},
		animation = true,
		options_elems = [];

	var app = {
		name: 'apiexplorer',

		css: [ 'app', 'xcode' ],

		i18n: {
			'en-US': { customCss: false },
			'fr-FR': { customCss: false },
			'ru-RU': { customCss: false },
			'es-ES': { customCss: false }
		},

		requests: {},
		subscribe: {},

		load: function(callback) {
			var self = this;

			self.initApp(function() {
				callback && callback(self);
			});
		},

		initApp: function(callback) {
			var self = this;

			self.getAnimationFlag();
			self.additionalSteps();
			self.getKazooMethods();

			monster.pub('auth.initApp', {
				app: self,
				callback: callback
			});
		},

		render: function(container) {
			var self = this,
			template, intervalID,
			iter = 0, dataCount = 4, leftTitles = "",
			parent = container || $('#monster-content');

			self.filterMethods();
			leftTitles = self.getLeftTitles();

			self.getNToMProperty(iter * dataCount, (iter + 1) * dataCount, function (data) {
				template = $(monster.template(self, 'app', data));

				if (animation) {
					template.find(".left-menu .toggle_animation").text(self.i18n.active().main.animation_off);
				} else {
					template.find(".left-menu .toggle_animation").text(self.i18n.active().main.animation_on);
				}

				template.find(".left-menu .category-group .category").append(leftTitles);
				self.bindEvents(template);
				parent.empty().append(template);

				intervalID = setInterval(function () {
					iter++;

					self.getNToMProperty(iter * dataCount, (iter + 1) * dataCount, function (data) {
						template = $(monster.template(self, 'app', data));
						template.find('.item__submit').text(self.i18n.active().main.request);
						$('#content').append(template.find('.block'));
					});

					if (iter * dataCount > Object.keys(methodsGenerator).length) {
						clearInterval(intervalID);
					}
				}, 100);
			});
		},

		bindEvents: function(parent) {
			var self = this,
			item_block,
			item_block_title,
			item_body,
			item_title,
			item_request,
			item_response,
			item_submit,
			item_data,
			item_params = "",
			item_schemas,
			arr_params = [],
			url_request = "",
			device_list,
			device_options = "",
			device_ids = [],
			method = "",
			container = parent.find('.right-content');

			self.leftBindEvents(parent);

			$(container).on('click', '.block__title', function () {
				item_block_title = $(this).closest('.block');

				if ($(this).css('margin-bottom') != '16px') {
					$(this).css('margin-bottom', '16px');
					$(this).addClass('block__title-minus');
					$(item_block_title).addClass('one_line');
				} else {
					$(this).css('margin-bottom', '0px');
					$(this).removeClass('block__title-minus');
					$(item_block_title).removeClass('one_line');
				}

				if (animation) {
					$(item_block_title).find('.item__content').toggle(500, 'swing');
				} else {
					$(item_block_title).find('.item__content').toggle();
				}
			});

			container.find('.item__submit').text(self.i18n.active().main.request);
			container.find('.item__title:empty').closest('.block').remove();

			self.addDataLists(container);

			container.find('.content').on("click", '.item__head', function() {
				item_block = $(this).parent();
				item_body = $(item_block).find('.item__body');
				item_response = $(item_body).find('.item__response');

				if ($(item_body).hasClass('dnone') && $(item_response).text().length == 0) {
					$(item_body).removeClass('dnone');

					item_title = $(item_block).find('.item__title');
					item_request = $(item_body).find('.item__request');
					item_submit = $(item_body).find('.item__submit');
					item_data = $(item_body).find('.item__data');

					item_params = "";
					method = $(item_block).find('.item__method').text().toLowerCase();
					item_schemas = $(this).find('.schemas').val();

					arr_params = $(item_title).text().match(/\{.+?\}/g);
					if (arr_params !== null) {
						arr_params = $.map(arr_params, function (elem, i) {
							return elem.replace(/\{|\}/g, "");
						});
						$.each(arr_params, function (i, elem) {
							item_params += '<input type="text" class="item__input ' + elem + '" placeholder="' + elem.replace(/([A-Z0-9])/g, " $1").toLowerCase() + '" />';
						});

						$(item_data).html(item_params);

						if ($.inArray("accountId", arr_params) !== -1) {
							$(item_data).find(".accountId").val(monster.apps.auth.accountId);
						}
						if ($.inArray("userId", arr_params) !== -1) {
							$(item_data).find(".userId").val(monster.apps.auth.userId);
						}
						if ($.inArray("token", arr_params) !== -1) {
							$(item_data).find(".token").val(monster.apps.auth.authToken);
						}
						if ($.inArray("domain", arr_params) !== -1) {
							$(item_data).find(".domain").val(monster.apps.auth.apiUrl);
						}

						$.each(options_elems, function (i, elem) {
							if ($.inArray(elem + "Id", arr_params) !== -1) {
								$(item_data).find("." + elem + "Id").attr("list", elem + "Id");

								if ($("datalist#" + elem + "Id option").size() > 12) {
									$(item_data).find("." + elem + "Id").on("dblclick", function () {
										$('body').animate({scrollTop: $(this).offset().top - 5}, 600);
									});
								}
							}
						});
					}

					if (method == "post" || method == "patch" || method == "put") {
						if (item_schemas !== "") {
							$.ajax({
								url: monster.config.api.default + item_schemas,
								type: "get",
								headers: {
									"Accept": "application/json",
									"Content-Type": "application/json"
								},
								success: function(data) {
									var inner_template, template_schema = $(monster.template(self, 'schema', data.data.properties));

									$(item_data).append("<br/><hr/><div class='name_obj'>" + self.defElem(data.data.name) + "</div>");
									$(item_data).append(template_schema);

									// $.each(data.data.properties, function (i, elem) {
									// 	if (defElem(elem.type) == "object" && self.defElem(elem.properties) != false &&
									// 	defElem(elem.$ref) == false && self.defElem(elem.additionalProperties) == false) {
									// 		inner_template = $(monster.template(self, 'schema', elem.properties));
									// 		$(item_data).find('.object[data-key="' + i + '"]').append(inner_template);
									// 	}
									// });

									$(item_body).css("max-height", $(item_response).height() + $(item_request).height() + 120 + "px");
								},
								error: function(data) {
									console.log("Error: " + JSON.stringify(data, null, '\t'));
								}
							});
						}
					}
				} else {
					if ($(item_body).hasClass('dnone')) {
						$(item_body).removeClass('dnone');
					} else {
						$(item_body).addClass('dnone');
					}
				}
			});

			self.bindSubmit(container);
			self.bindAnimation();
		},

		leftBindEvents: function(parent) {
			var timeoutID, textSearch = "", self = this, scroll = 0;

			parent.find('.left-menu .category-group .category').on('click', '.show_all', function () {
				if (animation) {
					parent.find(".show_all").toggle(true).toggle(300, 'linear');
				} else {
					parent.find(".show_all").toggle(false);
				}

				parent.find(".block").toggle(true);
				parent.find(".box-up .slade-down-all").trigger("click");

				parent.find('.left-menu .category-group .category .left__title').css("box-shadow", "none");
				parent.find('#search').val("").trigger("keyup").focus();
			});

			parent.find('.left-menu .category-group .category').on('click', '.left__title', function () {
				var left_title_text = $(this).text();

				if (animation) {
					parent.find(".show_all").toggle(false).toggle(300, 'linear');
				} else {
					parent.find(".show_all").toggle(true);
				}

				parent.find('.left-menu .category-group .category .left__title').css("box-shadow", "none");
				$(this).css("box-shadow", "0px 0px 8px -2px #35f inset");

				parent.find(".block").toggle(false);
				parent.find(".block__title[data-id='" + left_title_text + "']").closest(".block").toggle(true);

				if (parent.find(".block__title[data-id='" + left_title_text + "']").css("margin-bottom") != "16px") {
					parent.find(".block__title[data-id='" + left_title_text + "']").trigger("click");
				}
			});

			$('body').on('keyup', '#search', function (e) {
				clearTimeout(timeoutID);

				if ($(this).val() != "") {
					timeoutID = setTimeout(function () {
						textSearch = $('#search').val().toLowerCase();
						parent.find('.block').toggle(false);
						$.each(parent.find('.block'), function (i, elem) {
							if ($(this).find('.block__title').attr('data-id').toLowerCase().indexOf(textSearch) != -1) {
								$(this).toggle(true);
							}
						});
						parent.find('.left-menu .left__title').toggle(false);
						parent.find('.left-menu .left__title[data-title*="' + $('#search').val().toLowerCase() + '"]').toggle(true);
					}, 600);
				} else {
					parent.find('.block').toggle(true);
					parent.find('.left-menu .left__title').toggle(true);
				}
			});

			$(window).on('scroll', function () {
				scroll = pageYOffset || (document.documentElement.clientHeight ? document.documentElement.scrollTop : document.body.scrollTop);
				if (scroll > $('.left-menu.developer').height() + 34) {
					$('.box-up').css("position", "fixed");
				} else {
					$('.box-up').css("position", "static");
				}
			});

			parent.find('.box-up').on('click', '.up', function () {
				$('body, html').animate({scrollTop: 0}, 600);
			});

			parent.find('.box-up').on('click', '.slade-down-all', function () {
				parent.find('.one_line .block__title').css('margin-bottom', '0px').removeClass('block__title-minus');
				if (animation) {
					parent.find('.one_line').removeClass('one_line').find('.item__content').toggle(500, 'swing');
				} else {
					parent.find('.one_line').removeClass('one_line').find('.item__content').toggle();
				}
			});
		},

		bindSubmit: function(container) {
			var self = this;

			container.find(".content").on("click", ".item__submit", function() {
				var item_block = $(this).closest(".item__content"),
				item_body = $(item_block).find('.item__body'),
				item_data = $(item_block).find('.item__data'),
				item_title = $(item_block).find('.item__title'),
				method = $(item_block).find('.item__method').text().toLowerCase(),
				content_type = $(item_block).find('.content-type').val();

				content_type = (content_type === "") ? "application/json" : content_type;

				self.getValidData(item_data, item_title, function (valid, url, request_data) {
					if (valid) {
						$(item_block).find('.box.loading').fadeIn();
						self.getResponse(method, url, content_type, request_data, item_body);
					} else {
						monster.ui.alert('info', self.i18n.active().main.invalid_form);
					}
				});
			});
		},

		bindAnimation: function() {
			$("body").on("click", ".toggle_animation", function () {
				if (animation) {
					localStorage.animation = "false";
				} else {
					localStorage.animation = "true";
				}

				window.location.reload();
			});
		},

		getValidData: function(item_data, item_title, callback) {
			var valid = true, params_query = [], params_data = {}, request_data = {};

			$(item_data).find(".item__input[required='true']").each(function (i, elem) {
				if ($(elem).val().length === 0) {
					valid = false;
					return false;
				}
			});

			$(item_data).find(".item__input").not(".input-block .item__input").each(function (i, elem) {
				params_query[i] = $(elem).val();

				if ($(elem).val().length === 0) {
					valid = false;
					return false;
				}
			});

			$(item_data).find(".input-block .item__input").each(function (i, elem) {
				if ($(elem).val().length !== 0) {
					params_data[$(elem).attr("name")] = ($(elem).attr("type") === "checkbox") ? $(elem).is(":checked") : $(elem).val();
				}
			});

			request_data["data"] = params_data;

			url_request = monster.config.api.default + $(item_title).text();

			for (var i = 0, len = params_query.length; i < len; i++) {
				url_request = url_request.replace(/\{.+?\}/, params_query[i]);
			}

			callback && callback(valid, url_request, request_data);
		},

		getResponse: function(method, url, content_type, request_data, item_body) {
			var item_response = item_body.find('.item__response'), item_request = item_body.find('.item__request');

			$.ajax({
				url: url,
				type: method,
				data: JSON.stringify(request_data),
				headers: {
					"Accept": content_type,
					"Content-Type": content_type,
					"X-Auth-Token": monster.apps.auth.authToken
				},
				success: function(data) {
					item_response.html("<br/><div class='pre_block'><pre class='pre'>URL: " + url + "</pre><div class='copy-btn fa fa-copy'></div></div><br/><div class='pre_block'><pre class='pre'>" + JSON.stringify(data, null, '   ') + "</pre><div class='copy-btn fa fa-copy'></div></div>");
					item_body.css("max-height", item_response.height() + item_request.height() + 50 + "px");
					item_response.find(".pre").each(function (i, block) {
						hljs.highlightBlock(block);
					});
					item_body.find('.box.loading').fadeOut(600);
				},
				error: function(data) {
					item_response.html("<br/><div class='pre_block'><pre class='pre'>URL: " + url + "</pre><div class='copy-btn fa fa-copy'></div></div><br/><div class='pre_block'><pre class='pre'>" + JSON.stringify(data, null, '   ') + "</pre><div class='copy-btn fa fa-copy'></div></div>");
					item_body.css("max-height", item_response.height() + item_request.height() + 50 + "px");
					item_response.find(".pre").each(function (i, block) {
						hljs.highlightBlock(block);
					});
					item_body.find('.box.loading').fadeOut(600);
				}
			});
		},

		getNToMProperty: function(n, m, callback) {
			var newObject = {}, j = 0;
			m -= 1;

			$.each(methodsGenerator, function(i, elem) {
				if (j >= n) {
					if (j > m) return false;
					newObject[i] = $.extend({}, elem);
				}

				j++;
			});

			callback && callback(newObject);
		},

		filterMethods: function() {
			if (monster.config.developerFlags.readOnly === true) {
				$.each(methodsGenerator, function (i, elem) {
					$.each(elem, function (j, sub_elem) {
						if ((sub_elem.verb + "").toLowerCase() !== "get" && j != "title") {
							delete elem[j];
						}
					});
				});
			}
		},

		getLeftTitles: function(callback) {
			var leftTitles = "";

			$.each(methodsGenerator, function (i, elem) {
				leftTitles += "<div class='left__title' data-title='" + elem.title.toLowerCase() + "'>" + elem.title + "</div>";
			});

			return leftTitles;
		},

		addDataLists: function(container) {
			var self = this, data = [
				['list', 'id', 'appsStore', 'app'],
				['list', 'id', 'callflow', 'callflow'],
				['list', 'id', 'cdrs', 'cdr'],
				['list', 'id', 'clickToCall', 'clickToCall'],
				['list', 'id', 'conference', 'conference'],
				['list', '', 'connectivity', 'connectivity'],
				['list', 'id', 'device', 'device'],
				['list', 'id', 'directory', 'directory'],
				['list', 'id', 'faxbox', 'faxbox'],
				['getLogs', 'id', 'faxes', 'log'],
				['list', 'id', 'group', 'group'],
				['list', 'id', 'localResources', 'resource'],
				['listJobs', 'id', 'localResources', 'job'],
				['list', 'id', 'media', 'media'],
				['list', 'id', 'menu', 'menu'],
				['listAll', 'numbers', 'numbers', 'phoneNumber'],
				['list', 'id', 'port', 'portRequest'],
				['list', 'id', 'servicePlan', 'plan'],
				['list', 'id', 'voicemail', 'voicemail'],
				['list', 'id', 'webhooks', 'webhook'],
				['listNotifications', 'id', 'whitelabel', 'notification']
			];

			$.each(data, function (i, elem) {
				self.addDataList(container, elem[0], elem[1], elem[2], elem[3]);
			});
		},

		addDataList: function(container, method, prop, resource, name_res) {
			var self = this, resource_ids, resource_options = "", name = "", value;

			self.callApi({
				resource: resource + '.' + method,
				data: {
					accountId: monster.apps.auth.accountId,
					userId: monster.apps.auth.userId
				},
				success: function(data) {
					resource_ids = data.data;
					if (resource_ids.length > 0) {
						$.each(resource_ids, function (i, elem) {
							value = (prop !== "") ? elem[prop] : elem;
							name = self.getPropName(elem, prop);
							resource_options +=  '<option value="' + value + '">' + name + '</option>';
						});
						container.append('<datalist id="' + name_res + 'Id">' + resource_options + '</datalist>');
						options_elems.push(name_res);
					}
				},
				error: function(data) {
					console.log("Error: " + JSON.stringify(data, null, '\t'));
				}
			});
		},

		getPropName: function(elem, prop) {
			return this.defElem(elem["name"]) || this.defElem(elem["numbers"])[0] ||
			this.defElem(this.defElem(elem["featurecode"])["name"]) || this.defElem(elem[prop]) ||
			this.defElem(elem["id"]) || "";
		},

		defElem: function(elem) {
			var length = 0;

			if (typeof elem === "string" || typeof elem === "number") {
				length = (elem + "").length;
			} else {
				if (typeof elem === "object") {
					length = Object.keys(elem).length;
				}
			}

			return (typeof elem != "undefined" && length > 0) ? elem : false;
		},

		getKazooMethods: function() {
			$.ajax({
				url: 'apps/' + this.name + '/lib/kazoo.methods.js',
				async: false,
				crossDomain: true,
				dataType: 'text',
				success: function(data) {
					methodsGenerator = $.parseJSON(data);
				},
				error: function(data) {
					methodsGenerator = $.parseJSON(data);
				}
			});
		},

		additionalSteps: function() {
			var styles = "";
			if (animation) {
				styles += ".item__body,.dnone{transition: max-height 1s, padding 1.2s}" +
				".block,.one_line,.one_line .item__content,.one_line .item__title,.one_line .item__head{transition: width .4s}" +
				".copy-btn{transition: all .5s}";
			}

			switch(this.currentBrowser()) {
				case "firefox":
					styles += ".block__title:after{line-height:22px}";
					break;

				case "ie":
					styles += ".block__title:after{line-height:24px;padding-right:0px!important}";
					break;
			}

			setTimeout(function () {
				$("head").append("<style>" + styles + "</style>");
			}, 1000);

			Handlebars.registerHelper('cond', function (expression, options) {
				var fn = function() {}, result;

				try {
					fn = Function.apply(this, ['return ' + expression + ' ;']);
				} catch(e) {}
				try {
					result = fn.bind(this)();
				} catch(e) {}

				return result ? options.fn(this) : options.inverse(this);
			});

			$.getScript("apps/" + this.name + "/lib/clipboard.min.js", function (data, textStatus, jqxhr) {
				var clip = new Clipboard('.copy-btn', {
					text: function(trigger) {
						return $(trigger).parent().find(".pre").text();
					}
				});

				clip.on('success', function (e) {
					e.clearSelection();
					$(e.trigger).css("color", $(e.trigger).css("background-color"));
					setTimeout(function () {
						$(e.trigger).removeClass("fa-copy").addClass("fa-check").css("color", "#2f6");
					}, 600);
					setTimeout(function () {
						$(e.trigger).css("color", $(e.trigger).css("background-color"));
						setTimeout(function () {
							$(e.trigger).removeClass("fa-check").addClass("fa-copy").css("color", "#fff");
						}, 600);
					}, 5000);
				});
			});
		},

		getAnimationFlag: function() {
			if ((localStorage.getItem("animation") !== null && localStorage.getItem("animation") === "false") ||
			(localStorage.getItem("animation") !== "true" && monster.config.developerFlags.animation === false)) {
				animation = false;
			} else {
				animation = true;
			}
		},

		currentBrowser: function() {
			var ua = navigator.userAgent, bName, version;

			if (ua.search(/Konqueror/) > -1) bName = "konqueror";
			if (ua.search(/Iceweasel/) > -1) bName = "iceweasel";
			if (ua.search(/SeaMonkey/) > -1) bName = "seamonkey";
			if (ua.search(/Safari/) > -1) bName = "safari";
			if (ua.search(/Trident/) > -1 || ua.search(/MSIE/) > -1) bName = "ie";
			if (ua.search(/Opera/) > -1) bName = "opera";
			if (ua.search(/Chrome/) > -1) bName = "chrome";
			if (ua.search(/Firefox/) > -1) bName = "firefox";

			switch (bName) {
				case "ie": version = (ua.split("rv:")[1]).split(";")[0]; break;
				case "firefox": version = ua.split("Firefox/")[1]; break;
				case "opera": version = ua.split("Version/")[1]; break;
				case "chrome": version = (ua.split("Chrome/")[1]).split(" ")[0]; break;
				case "safari": version = (this.defElem((ua.split("Version/")[1]))) ? ua.split("Version/")[1].split(" ")[0] : ""; break;
				case "konqueror": version = this.defElem((ua.split("KHTML/")[1])).split(" ")[0]; break;
				case "iceweasel": version = this.defElem((ua.split("Iceweasel/")[1])).split(" ")[0]; break;
				case "seamonkey": version = ua.split("SeaMonkey/")[1]; break;
			}

			return bName;
		}
	};

	return app;
});