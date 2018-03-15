define(function(require){
	var $ = require('jquery'),
		jQui = require('jqueryui'),
		highlighter = require('hljs'),
		clipboard = require('clipboard'),
		monster = require('monster'),
		methodsGenerator = {},
		domProps = [];
		animation = true;
	
	var Handlebars = require('handlebars');
    var Clipboard = require('clipboard');

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
			parent = container || $('#monster_content');

			self.filterMethods();
			leftTitles = self.getLeftTitles();

			self.getNToMProperty(iter * dataCount, (iter + 1) * dataCount, function (data) {
				self.dataSort(data, function(n_data) {
					template = $(monster.template(self, 'app', n_data));
					template.find(".left-menu .category-group .category").append(leftTitles);

					self.bindEvents(template, function () {
						parent.empty().append(template);

						intervalID = setInterval(function () {
							iter++;

							self.getNToMProperty(iter * dataCount, (iter + 1) * dataCount, function (data) {
								self.dataSort(data, function(n_data) {
									template = $(monster.template(self, 'app', n_data));
									$('#content').append(template.find('.block'));
								});
							});

							if (iter * dataCount > Object.keys(methodsGenerator).length) {
								clearInterval(intervalID);
							}
						}, 100);

						setTimeout(function () {
							$(".box-up").css("max-width", $(".buffer").width());
						}, 3000);
					});
				});
			});
		},

		bindEvents: function(parent, callback) {
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
			placeholder = "",
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

			container.find('.item__title:empty').closest('.block').remove();

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
							placeholder = elem.replace(/([A-Z0-9])/g, " $1").toLowerCase();
							item_params += '<div class="box_query">';
							item_params += '<div class="ph_query" title=' + elem + '>' + self.i18n.active().main.query_param + ': <span> ' + placeholder + '</span></div>';
							item_params += '<input type="text" class="item__input ' + elem + '" placeholder="' + placeholder + '" />';
							item_params += '</div>';
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

						self.addDataLists(container);
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

									domProps = [];

									self.propsToDOM(data.data.properties, 0, "", function() {
										$(item_body).css("max-height", $(item_response).height() + $(item_request).height() + 120 + "px");

										$(item_data).on("click", ".add-input", function() {
											var id = Math.random().toString(36).substring(14);
											$(item_data).find(".block-costum")
											.append("<div class='input-block input-block-prop'><input id='" + id + "' data-level='0' type='text' placeholder='Costum key' class='item__input item__input-prop' /></div>");

											self.propComplete($(item_data).find(".input-block-prop:last-child()"), "#" + id, "", 0, function() {
												$(item_body).css("max-height", $(item_response).height() + $(item_request).height() + 120 + "px");
											});

											$(item_body).css("max-height", $(item_response).height() + $(item_request).height() + 120 + "px");
										});
									});
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
			self.bindConfig();

			callback && callback();
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

			container.find(".content").on("click", ".item__submit", function(e) {
				e.preventDefault();
				var item_block = $(this).closest(".item__content"),
				item_body = $(item_block).find('.item__body'),
				item_data = $(item_block).find('.item__data'),
				item_title = $(item_block).find('.item__title'),
				method = $(item_block).find('.item__method').text().toLowerCase(),
				content_type = $(item_block).find('.content-type').val();

				content_type = (content_type === "") ? "application/json" : content_type;

				self.getValidData(item_data, item_title, function (valid, url, request_data) {
					if (valid) {
						$(item_block).find('.btn-loading').removeClass('btn-loading');
						$(item_block).find('.js-send-request').addClass('btn-loading');
						self.getResponse(method, url, content_type, request_data, item_body);
					} else {
						monster.ui.alert('info', self.i18n.active().main.invalid_form);
					}
				});
			});
		},

		bindConfig: function() {
			var self = this, config_template = "<div class='config__box'>";
			var checked = (localStorage.animation == "true") ? "checked" : "";
			config_template += "<label class='label_animation' for='animation_config'>" + self.i18n.active().main.animation + ": ";
			config_template += "<input type='checkbox' id='animation_config' class='animation_config' " + checked + "/></label>";
			config_template += "<div class='btn btn-success config_save'>" + self.i18n.active().main.save_config + "</div>";
			config_template += "</div>";

			$("body").on("click", ".config", function () {
				monster.ui.dialog($(config_template), {
					title: self.i18n.active().main.title_config,
					width: '400px'
				});
			});

			$("body").on("click", ".config_save", function () {
				localStorage.animation = "" + $(".animation_config").prop('checked');

				window.location.reload();
			});
		},

		propComplete: function(parent, selector, parentProp, level, callback) {
			var self = this, props = [];

			$.each(domProps, function(i, item) {
				if (item.level == level && (item.parent == parentProp || parentProp == "")) {
					props.push(item);
				}
			});

			$(parent).find(selector).autocomplete({
				source: props,
				minLength: 0,
				delay: 0,
				create: function() {
					$(this).on("focus", function() {
						$(this).autocomplete("search" , "");
					});
				},
				select: function(event, ui) {
					var thisElem = this,
					id = Math.random().toString(36).substring(14);

					$(thisElem).attr("data-additional", ui.item.additional)
						.attr("data-parent", ui.item.parent)
						.attr("title", ui.item.title);

					$(parent).find(".item__input").filter(function(){return $(this).attr("data-level") > $(thisElem).attr("data-level")}).remove();
					level = parseInt($(thisElem).attr("data-level"), 10) + 1;

					if (ui.item.type == "select") {
						$(parent).append("<input id='" + id + "' data-level='" + level + "' type='text' placeholder='Costum key' class='item__input item__input-prop' />");
						$(parent).find("#" + id).attr("style", "margin-left: " + level + "rem !important");
						self.propComplete(parent, "#" + id, ui.item.value, level, function() {
							callback && callback();
						});
					} else {
						$(parent).append("<input id='" + id + "' data-level='" + level + "' type='" + ui.item.type + "' placeholder='Costum value' class='item__input item__input-value' />");
						$(parent).find("#" + id).attr("style", "margin-left: " + level + "rem !important");
						callback && callback();
					}
				}
			});
		},

		propsToDOM: function(props, level, parent, callback) {
			var self = this;

			$.each(props, function(i, item) {
				if (typeof item.type !== "undefined" && item.type == "object" && typeof item.properties !== "undefined") {
					domProps.push({
						value: i,
						label: item.name || i.replace("_", " "),
						title: item.description || i.replace("_", " "),
						level: level,
						parent: parent,
						type: "select",
						additional: false
					});
					self.propsToDOM(item.properties, level + 1, i);
				} else {
					if (typeof item.type !== "undefined" && item.type == "object" &&
					typeof item.additionalProperties !== "undefined" &&
					typeof item.additionalProperties.properties !== "undefined") {
						domProps.push({
							value: i,
							label: item.name || i.replace("_", " "),
							title: item.description || i.replace("_", " "),
							level: level,
							parent: parent,
							type: "select",
							additional: true
						});
						self.propsToDOM(item.additionalProperties.properties, level + 1, i);
					} else {
						if (item.type == "number" || item.type == "string" || item.type == "integer" ||  item.type == "boolean") {
							domProps.push({
								value: i,
								label: item.name || i.replace("_", " "),
								title: item.description || i.replace("_", " "),
								level: level,
								parent: parent,
								type: (item.type == "boolean") ? "checkbox" : "text",
								additional: false
							});
						}
					}
				}
			});

			callback && callback();
		},

		getValidData: function(item_data, item_title, callback) {
			var valid = true, params_query = [], params_data = {}, request_data = {}, costumValue, costumParams = {};

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

			$(item_data).find(".input-block:not(.input-block-prop) .item__input").each(function (i, elem) {
				if ($(elem).val().length !== 0) {
					params_data[$(elem).attr("name")] = ($(elem).attr("type") === "checkbox") ? $(elem).is(":checked") : $(elem).val();
				}
			});

			$(item_data).find(".input-block-prop").each(function (i, elem) {
				costumValue = $(elem).find(".item__input-value");
				if($(costumValue).val().length !== 0 || $(costumValue).attr("type") === "checkbox") {
					costumParams[$(elem).find(".item__input-prop").last().val()] = ($(costumValue).attr("type") === "checkbox") ? $(costumValue).is(":checked") : $(costumValue).val();

					$($(elem).find(".item__input-prop").not(":last()").not(":first()").get().reverse()).each(function (j, item) {
						costumParams[$(item).val()] = costumParams;
					});

					params_data[$(elem).find(".item__input-prop").first().val()] = costumParams;
					costumParams = {};
				}
			});

			request_data["data"] = params_data;

			url_request = monster.config.api.default + $(item_title).text();

			for (var i = 0, len = params_query.length; i < len; i++) {
				url_request = url_request.replace(/\{.+?\}/, params_query[i]);
			}

			callback && callback(valid, url_request, request_data);
		},

		getResponse: function(method, url, content_type, request_data, item_body, nextStartKey) {
			var self = this;
			var item_response = item_body.find('.item__response'),
				item_request = item_body.find('.item__request');

			var modifiedUrl = url;

			if(typeof(nextStartKey) !== 'undefined') {
				var paramPrefix = (modifiedUrl.indexOf('?') === -1 ? '?' : '&');
				modifiedUrl += paramPrefix + 'start_key=' + encodeURIComponent(nextStartKey);
			}

			// hard limit count of objects in each response
			// modifiedUrl += (modifiedUrl.indexOf('?') === -1) ? '?page_size=3': '&page_size=3';

			$.ajax({
				url: modifiedUrl,
				type: method,
				data: JSON.stringify(request_data),
				headers: {
					"Accept": content_type,
					"Content-Type": content_type,
					"X-Auth-Token": monster.apps.auth.getAuthToken()
				},
				success: function(data) {
					var $buttonsBox = item_body.find('.js-request-buttons-box');
					$buttonsBox.find('.js-next-request').remove();
					var $sendBtn = $buttonsBox.find('.js-send-request');
					$sendBtn.html('<i class="fa fa-repeat"></i> ' + self.i18n.active().apiexplorer.sendFirstRequestBtnText);

					if(data.next_start_key) {
						var $nextBtn = $('<a class="js-next-request btn"><i class="fa fa-paper-plane"></i> ' + self.i18n.active().apiexplorer.nextRequestBtnText + '</a>')
							.appendTo($buttonsBox)
							.on('click', function(e) {
								e.preventDefault();
								$(this).addClass('btn-loading');
								self.getResponse(method, url, content_type, request_data, item_body, data.next_start_key);
							});
					}

					item_response.html("<br/><div class='pre_block'><pre class='pre'>URL: <span class='copy-text'>" + url + "</span></pre><div class='copy-btn fa fa-copy'></div></div><br/><div class='pre_block'><pre class='pre'><span class='copy-text'>" + JSON.stringify(data, null, '   ') + "</span></pre><div class='copy-btn fa fa-copy'></div></div>");
					item_body.css("max-height", item_response.height() + item_request.height() + 50 + "px");
					item_response.find(".pre").each(function (i, block) {
						hljs.highlightBlock(block);
					});
					item_body.find('.btn-loading').removeClass('btn-loading');
				},
				error: function(data) {
					item_body.find('.js-send-request').html('<i class="fa fa-repeat"></i> ' + self.i18n.active().apiexplorer.sendFirstRequestBtnText);
					item_response.html("<br/><div class='pre_block'><pre class='pre'>URL: <span class='copy-text'>" + url + "</span></pre><div class='copy-btn fa fa-copy'></div></div><br/><div class='pre_block'><pre class='pre'><span class='copy-text'>" + JSON.stringify(data, null, '   ') + "</span></pre><div class='copy-btn fa fa-copy'></div></div>");
					item_body.css("max-height", item_response.height() + item_request.height() + 50 + "px");
					item_response.find(".pre").each(function (i, block) {
						hljs.highlightBlock(block);
					});
					item_body.find('.btn-loading').removeClass('btn-loading');
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

		dataSort: function(data, callback) {
			var n_data = {};

			$.each(data, function (i, elem) {
				var new_data = [];

				n_data[i] = {};

				$.each(elem, function (j, subelem) {
					new_data.push({key: j, value: subelem});
				});

				new_data.sort(function(a, b) {
					if (typeof a.value !== "string" && typeof b.value !== "string") {
						return b.value.verb.length - a.value.verb.length;
					} else {
						if (typeof a.value !== "string") return 1;
						if (typeof b.value !== "string") return -1;
					}

					return 0;
				});

				new_data.sort(function(a, b) {
					if (typeof a.value !== "string" && typeof b.value !== "string") {
						return a.value.url.length - b.value.url.length ||
							(a.value.url > b.value.url) - (a.value.url < b.value.url) ||
							a.value.verb.length - b.value.verb.length ||
							(a.value.verb > b.value.verb) - (a.value.verb < b.value.verb);
					} else {
						if (typeof a.value !== "string") return 1;
						if (typeof b.value !== "string") return -1;
					}

					return 0;
				});

				for(var k = 0, len = new_data.length; k < len; k++) {
					n_data[i][new_data[k].key] = new_data[k].value;
				}
			});

			callback && callback(n_data);
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
			var self = this, resource_ids, resource_options = [], name = "", value;

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
							resource_options.push({label: name, value: value});
						});
						$("." + name_res + "Id").autocomplete({source: resource_options, minLength: 0, delay: 0});
						$("." + name_res + "Id").on("focus", function() {
							$(this).autocomplete("search" , "");
						});
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
					methodsGenerator = $.parseJSON(data.responseText);
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

			var clip = new Clipboard('.copy-btn', {
				text: function(trigger) {
					return $(trigger).parent().find(".pre .copy-text").text();
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
	}

	return app;
});