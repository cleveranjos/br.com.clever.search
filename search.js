define(["qlik"],
	function (qlik) {
		//very basic styling
		var style = ".qv-object-search .containerl {border:1px solid black} " +
			".q.qv-object-search textarea {width:100%}" +
			".qv-object-search .panel {border:1px solid black} ";

		var element = document.createElement('style');
		element.innerHTML = style;
		document.head.appendChild(element);

		return {
			initialProperties: {
				qFieldListDef: {
					qShowSystem: false,
					qShowHidden: false,
					qShowSemantic: true,
					qShowSrcTables: true,
					qShowDerivedFields: true,
					qShowImplicit: true
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function ($element, layout) {
				var el = $element[0];
				//clear contents
				el.innerHTML = '';
				//set up basic structure
				var container = document.createElement('div'),
					panel = document.createElement('div');
				container.className = 'container';
				panel.className = 'panel';
				container.appendChild(panel);
				el.appendChild(container);
				var selectList = document.createElement("select");
				selectList.id = "sel" + layout["qInfo"].qId;
				let itens = layout["qFieldList"].qItems;//function(a, b){return a.qName.attr.localeCompare(b.qName.attr);});
				itens.sort(function (a, b) { return a.qName.attr > a.qName.attr }); //TODO
				itens.forEach(function (i) {
					var option = document.createElement("option");
					option.text = i.qName ? i.qName : i.qMeta.title;
					selectList.appendChild(option);
				});
				panel.appendChild(selectList);
				let btn = document.createElement("BUTTON");
				btn.innerHTML = "Pesquisar";
				btn.onclick = function () {
					var app = qlik.currApp(this);
					var list = [];
					document.getElementById("txt" + layout["qInfo"].qId).value.split('\n').forEach(function (l) {
						if (l.trim().length) list.push(l.trim());
					});
					params = "(" + list.join("|") + ")";
					app.field(document.getElementById("sel" + layout["qInfo"].qId).value).selectMatch(params);
					return false;
				};
				panel.appendChild(btn);
				var ta = document.createElement('TEXTAREA');
				ta.setAttribute('name', 'searchparams');
				ta.setAttribute('placeholder', 'Informe aqui os parametros de pesquisa');
				ta.setAttribute('maxlength', 5000);
				ta.setAttribute('cols', 60);
				ta.id = "txt" + layout["qInfo"].qId;
				//ta.setAttribute('rows', 40);
				panel.appendChild(ta);
				return qlik.Promise.resolve();
			},
			resize: function () {
				// don't need to repaint on resize
			}
		};

	});