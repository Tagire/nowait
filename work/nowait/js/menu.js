
Menu = function () {

	this.maxId = 0;

	this.currentEditedItem = undefined;

	this.categoryTemplateBasic = hereDoc(function() { /*!
		<div class="category-group">
			<div class="category-title section group">
				<h2>
					<%= title %>
					<span class="edit-category icon-pencil" data-id="<%= id %>"></span>
					<span class="delete-category icon-cancel" data-id="<%= id %>"></span>
				</h2>
			</div>
			<div class="section group item-group">
				<%= items %>
			</div>
		</div>
	*/});

	this.itemTemplateBasic = hereDoc(function() { /*!
		<div  class="col span_1_of_4 item">
			<h3>
				<%= title %>
				<span class="edit-item icon-pencil" data-id="<%= id %>"></span>
				<span class="delete-item icon-cancel" data-id="<%= id %>"></span>
			</h3>
			<p class="item-description">
				<%= description %>
			</p>
		</div>
	*/});

	this.categories = [];
	this.positions = [];

	this.getNextId = function () {
		return this.maxId++;
	}

	this.save = function () {

	}

	this.addItem = function (position) {
		this.positions.push(position);
	}

	this.editItem = function (position) {
		this.positions.forEach(function (currentValue, index, array) {
			if (currentValue.id == position.id) {
				array[position.id] = position;
			}
		});
	}

	this.getItemById = function (id) {
		var positions = this.positions.filter(function (currentValue, index, array) {
			return currentValue.id == id;
		});
		return positions.pop();
	}

	this.load = function (json) {
		this.categories = json.categories;
		this.positions = json.positions;

		var compareBySortId = function(a, b) {
			return a.sortId - b.sortId; 
		}

		this.categories.sort(compareBySortId);
		this.positions.sort(compareBySortId);

		this.positions.forEach(function (value, index, array) {
			if (this.maxId < value.id) {
				this.maxId = value.id;
			}
		}, this);
	}

	this.render = function () {
		var positionsGroupedByCategory = [];

		for (var i in this.categories) {
			positionsGroupedByCategory[i] = [];
		}

		this.positions.forEach(function (currentValue, index, array) {
			positionsGroupedByCategory[currentValue.categoryId].push(currentValue);
		});

		var itemTemplate = _.template(this.itemTemplateBasic);
		var categoryTemplate = _.template(this.categoryTemplateBasic);

		compiledTemplate = '';

		positionsGroupedByCategory.forEach(function (items, categoryId, array) {
			var itemsCompiled = '';

			items.forEach(function (item, itemId, array) {
				itemsCompiled += itemTemplate(item);
			});

			compiledTemplate += categoryTemplate({
				title: this.categories[categoryId].title,
				id: this.categories[categoryId].id,
				items: itemsCompiled
			});
		}, this);

		document.getElementById('menu-block').innerHTML = compiledTemplate;
	}

	this.bindEvents = function () {
		var menu = this;

		$(document).on("click", '.delete-item', function (e) {
			e.preventDefault();

			var element = $(e.target);
			element.parent().remove();

			menu.positions = menu.positions.filter(function (item, index, array) {
				return item.id != element.data('id');
			});
		});

		$(document).on("click", '.delete-category', function (e) {
			if (confirm("Are you sure want to delete category with all items?")) {
				e.preventDefault();

				var element = $(e.target);
				element.parent().parent().remove();

				menu.categories = menu.categories.filter(function (item, index, array) {
					return item.id != element.data('id');
				});
			}
		})
	}
}

$(document).ready(function() {

	menu = new Menu();

	function saveMenu() {

	}

	function loadMenu() {
		$.get("/data/menu.json", function (data) {
			menu.load(data);
			menu.render();
			menu.bindEvents();
		});
	}

	loadMenu();

	function save(e) {
		var formPosition = function (data) {
			var position = {};
			data.forEach(function (value, index, array) {
				position[value.name] = value.value;

			});
			if (!position.id) {
				position.id = menu.getNextId();
			}
			return position;
		}

		var form = $(this).find("#position-form");
		var formData = form.serializeArray();

		if (menu.currentEditedItem != undefined) {
			menu.editItem(formPosition(formData));
		} else {
			menu.addItem(formPosition(formData));
		}

		menu.render();

		dialog.dialog( "close" );
		return true;
	}

	function load(form, position) {
		_.each(position, function (value, index, array) {
			form.find('#' + index).val(value);
		});
	}

	function reset(form) {
		form[0].reset();
		form.find('#id').val('');
	}

	dialog = $( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 600,
		width: 350,
		modal: true,
		buttons: {
			"Save": save,
			Cancel: function() {
				dialog.dialog( "close" );
			}
		},
		close: function() {
			form[ 0 ].reset();
			//allFields.removeClass( "ui-state-error" );
		}
	});

	form = dialog.find( "form" ).on( "submit", function( event ) {
		event.preventDefault();
		save();
	});

	$(document).on( "click", ".edit-item", function(e) {
		reset(form);
		menu.currentEditedItem = $(e.target).data("id");
		dialog.dialog( "open" );
		load(form, menu.getItemById(menu.currentEditedItem));
	});

	$( "#add-product" ).button().on( "click", function() {
		reset(form);
		menu.currentEditedItem = undefined;
		dialog.dialog( "open" );
	});

	$( "#save-menu" ).button().on( "click", function() {
		alert("Saved");
	});
});
