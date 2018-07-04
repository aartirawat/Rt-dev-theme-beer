// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        /* Optional */
        loadProductFirst: true,
        numberFilterTree: 2,
        showLimitList: '24,36,48'
    },
};

// Declare Templates
var bcSfFilterTemplate = {
    // Grid Template
    'productGridItemHtml': '<article class="{{customClass}}" data-product-item tabindex="1">' +
                                '<div id="{{itemHandle}}" class="productitem" data-product-item-content>' +
                                    '<a class="productitem--image-link" href="{{itemUrl}}">' +
                                        '<figure class="productitem--image" data-product-item-image>' +
                                            '<img alt="{{itemTitle}}" src="{{itemThumbUrl}}">' +
                                            '{{itemLabels}}' +
                                        '</figure>' +
                                    '</a>' +
                                    '<div class="productitem--info">' + 
                                        '{{emphasizePrice}}'  +
                                        '<h2 class="productitem--title">' +
                                            '<a href="{{itemUrl}}" tabindex="1">' +
                                                '{{itemTitle}}' +
                                            '</a>' +
                                        '</h2>' +
                                        '{{noEmphasizePrice}}'  +
  									  '<div class="gridReviewTeaser" data-sku="{{itemSKU}}"></div> ' +
                                    '</div>' +
                                    '{{quickBtn}}' +
                                '</div>' +
                            '</article>',

    // Pagination Template
    'previousActiveHtml': '<li class="pagination--previous"><a class="pagination--item" href="{{itemUrl}}"><span class="pagination--chevron-left" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg></span>' + bcSfFilterConfig.label.prev + '</a></li>',
    'previousDisabledHtml': '',
    'nextActiveHtml': '<li class="pagination--next"><a class="pagination--item" href="{{itemUrl}}">' + bcSfFilterConfig.label.next + '<span class="pagination--chevron-right" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg></span></a></li>',
    'nextDisabledHtml': '',
    'pageItemHtml': '<li><a class="pagination--item" href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li class="pagination--active"><span class="pagination--item">{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li class="pagination--ellipsis"><span class="pagination--item">{{itemTitle}}</span></li>',
    'paginateHtml': '<div class="pagination--container"><ul class="pagination--inner">{{previous}}{{pageItems}}{{next}}</ul></div>',
  
    // Sorting Template
    'sortingHtml':  '<label class="utils-sortby-title" for="product_grid_sort">' + bcSfFilterConfig.label.sorting + '</label>' +
                    '<div class="utils-sortby-select form-field-select-wrapper no-label">' +
                        '<select class="form-field form-field-select">{{sortingItems}}</select>' +
                        '<svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="6" viewBox="0 0 8 6" > <g fill="currentColor" fill-rule="evenodd"> <polygon class="icon-chevron-down-left" points="4 5.371 7.668 1.606 6.665 .629 4 3.365"/> <polygon class="icon-chevron-down-right" points="4 3.365 1.335 .629 1.335 .629 .332 1.606 4 5.371"/> </g> </svg>' +
                    '</div>',

    // Show limit Template
    'showLimitHtml': '<li><span class="utils-showby-title">' + bcSfFilterConfig.label.show_per_page + '</span></li>{{showLimitItems}}',
};

/************************** BUILD PRODUCT LIST **************************/

// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index, totalProduct) {
    /*** Prepare data ***/
    var images = data.images_info;
    data.price_min *= 100, data.price_max *= 100, data.compare_at_price_min *= 100, data.compare_at_price_max *= 100; // Displaying price base on the policy of Shopify, have to multiple by 100
    var soldOut = !data.available; // Check a product is out of stock
    var onSale = data.compare_at_price_min > data.price_min; // Check a product is on sale
    var priceVaries = data.price_min != data.price_max; // Check a product has many prices
    // Get First Variant (selected_or_first_available_variant)
    var firstVariant = data['variants'][0];
    if (getParam('variant') !== null && getParam('variant') != '') {
        var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
        if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
    } else {
        for (var i = 0; i < data['variants'].length; i++) {
            if (data['variants'][i].available) {
                firstVariant = data['variants'][i];
                break;
            }
        }
    }
    /*** End Prepare data ***/

    // Get Template
    var itemHtml = bcSfFilterTemplate.productGridItemHtml;

    // Add custom class
    var customClass = 'productgrid--item imagestyle--' + bcSfFilterConfig.custom.product_grid_image_style;
    if (onSale) customClass += ' productitem--sale';
    if (bcSfFilterConfig.custom.emphasize_price) customClass += ' productitem--emphasis';
    itemHtml = itemHtml.replace(/{{customClass}}/g, customClass);

    // Add Thumbnail
    var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '512x') : bcSfFilterConfig.general.no_image_url;
    itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

    // Add Label
    var itemLabelsHtml = '';
    if (soldOut) {
        itemLabelsHtml += '<span class="productitem--badge badge--soldout">' + bcSfFilterConfig.label.sold_out +'</span>';
    } else {
        if (onSale && bcSfFilterConfig.custom.product_sales_badge) {
            var savePrice = data.compare_at_price_min - data.price_min;
            var percentSavePrice = Math.round(savePrice * 100 / data.compare_at_price_max);
            var savePriceHtml = '<span class="money" data-price-money-saved>' + this.formatMoney(savePrice) + '</span>';
            var percentSavePriceHtml = '<span data-price-percent-saved>' + percentSavePrice + '</span>';
            itemLabelsHtml += '<span class="productitem--badge badge--sale" data-badge-sales>';
            switch (bcSfFilterConfig.custom.product_sales_badge_style) {
                case 'percentile': itemLabelsHtml += bcSfFilterConfig.label.sale_percentile_html.replace(/{{ saved }}/g, percentSavePriceHtml); break;
                case 'money': itemLabelsHtml += bcSfFilterConfig.label.sale_money_html.replace(/{{ saved }}/g, savePrice); break;
                default: itemLabelsHtml += bcSfFilterConfig.label.sale; break;
            }
            itemLabelsHtml += '</span>';
        }
    }
    itemHtml = itemHtml.replace(/{{itemLabels}}/g, itemLabelsHtml);

    // Add Price
    var priceHtml = '';
    var classVaries = priceVaries ? 'price--varies' : '';
    var visibleClass = onSale || bcSfFilterConfig.custom.emphasize_price ? 'visible' : '';
    priceHtml += '<div class="productitem--price ' + classVaries + '">';
    priceHtml += '<div class="price--compare-at ' + visibleClass + '" data-price-compare-at>';
    var comparePrice = '<span class="money">' + this.formatMoney(data.compare_at_price_min) + '</span>';
    if (priceVaries && onSale){
        priceHtml += bcSfFilterConfig.label.range_html.replace(/{{ price }}/g, comparePrice);
    } else {
        if (onSale) {
            priceHtml += comparePrice;
        } else {
            if (bcSfFilterConfig.custom.emphasize_price) {
                priceHtml += '<span class="price--spacer"></span>';
            } else {
                priceHtml += '<span class="money"></span>';
            }
        }
    }
    priceHtml += '</div>';
    priceHtml += '<div class="price--main" data-price>';
    var price = '<span class="money">' + this.formatMoney(data.price_min) + '</span>';
    if (priceVaries) {
        priceHtml += bcSfFilterConfig.label.range_html.replace(/{{ price }}/g, price);
    } else {
        priceHtml += price;
    }
    priceHtml += '</div>';
    priceHtml += '</div>';
    // Add emphasize price
    var emphasizePriceHtml = '';
    var noEmphasizePriceHtml = '';
    if (bcSfFilterConfig.custom.emphasize_price) {
        emphasizePriceHtml += priceHtml;
    } else {
        noEmphasizePriceHtml += priceHtml;
    }
    itemHtml = itemHtml.replace(/{{emphasizePrice}}/g, emphasizePriceHtml);
    itemHtml = itemHtml.replace(/{{noEmphasizePrice}}/g, noEmphasizePriceHtml);

    // Add quickBtn
    var quickBtnHtml = '';
    var has_variants = firstVariant['option_title'] == 'Default Title' ? false : true;
    var show_modal = bcSfFilterConfig.custom.show_modal;
    if (bcSfFilterConfig.custom.enable_quick_look == true || bcSfFilterConfig.custom.enable_quick_buy == true) {
        var quick_look_text = bcSfFilterConfig.label.quick_look_text;
        var quick_buy_text = bcSfFilterConfig.label.quick_buy_text;
        var quick_look_classes = 'productitem--action-trigger button-secondary';
        var quick_buy_classes = 'productitem--action-trigger productitem--action-atc button-primary';
        if (has_variants) {
            quick_buy_text = bcSfFilterConfig.label.quick_choose_options;
            show_modal = true;
        }
        if (!data.available) {
            quick_buy_text = bcSfFilterConfig.label.sold_out;
            quick_buy_classes = quick_buy_classes + ' disabled';
        }
        quickBtnHtml += '<div class="productitem--actions" data-product-actions>';
        if (bcSfFilterConfig.custom.enable_quick_look) {
            quickBtnHtml += '<div class="productitem--action">' +
                                '<button class="'+ quick_look_classes +'" data-quickshop-full data-id="{{itemId}}" type="button" tabindex="1">' + quick_look_text +
                                '</button>' +
                            '</div>';
        }
        if (bcSfFilterConfig.custom.enable_quick_buy) {
            if (!has_variants) {
                var temp = ' data-quick-buy ';
            } else {
                var temp = ' data-quickshop-slim ';
            }
            quickBtnHtml += '<div class="productitem--action">' +
                                '<button class="' + quick_buy_classes + '" tabindex="1" type="button" aria-label="' + quick_buy_text + '"' +
                                temp + 'data-variant-id="' + data.variants[0].id + '"';
            if (!data.available) {
                quickBtnHtml += ' disabled';
            }
            quickBtnHtml += '>';
            quickBtnHtml += '<span class="atc-button--text">' + quick_buy_text + '</span>';
            quickBtnHtml += '<span class="atc-button--icon">';
            quickBtnHtml += '<svg aria-hidden="true" focusable="false" role="presentation" width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg" > <g fill-rule="nonzero" fill="currentColor"> <path d="M13 26C5.82 26 0 20.18 0 13S5.82 0 13 0s13 5.82 13 13-5.82 13-13 13zm0-3.852a9.148 9.148 0 1 0 0-18.296 9.148 9.148 0 0 0 0 18.296z" opacity=".29"/><path d="M13 26c7.18 0 13-5.82 13-13a1.926 1.926 0 0 0-3.852 0A9.148 9.148 0 0 1 13 22.148 1.926 1.926 0 0 0 13 26z"/> </g> </svg>';
            quickBtnHtml += '</span>';
            quickBtnHtml += '</button>';
            quickBtnHtml += '</div>';
        }

        quickBtnHtml += '</div>';
    }
    itemHtml = itemHtml.replace(/{{quickBtn}}/g, quickBtnHtml);

    // Add main attribute (Always put at the end of this function)
    itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
    itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  var t = '';
  if(data.title.substring(0,50).length > 30) {
    t = '...';
  }
    //itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title.substring(0,30)+t);
    itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
    itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));
    itemHtml = itemHtml.replace(/{{itemSKU}}/g, data.id);
    // Build content for Modal
    var quickUrl = this.buildProductItemUrl(data) + '?view=quickview';
    jQ.ajax({url: quickUrl, success: function(result){
        jQ('#' + data.handle).after(result);
        
        if (index == totalProduct) {
            var sections = new bcSections();
            sections.register('static-collection', function (section) {
                return new bcStaticCollection(section);
            });
        }
    }});

    return itemHtml;
};

// Customize data to suit the data of Shopify API
BCSfFilter.prototype.prepareProductData = function(data) {
    for (var k in data) {
        // Featured image
        if (data['images_info'] > 0) {
            data[k]['featured_image'] = data['images_info'][0];
        } else {
            data[k]['featured_image'] = {width: '', height: '', aspect_ratio: 0}
        }

        // Add Options
        var optionsArr = [];
        for (var i in data[k]['options_with_values']) {
            optionsArr.push(data[k]['options_with_values'][i]['name']);
        }
        data[k]['options'] = optionsArr;

        // Customize variants
        for (var i in data[k]['variants']) {
            var variantOptionArr = [];
            var count = 1;
            var variant = data[k]['variants'][i];
            // Add Options
            var variantOptions = variant['merged_options'];
            if (Array.isArray(variantOptions)) {
                for (var j = 0; j < variantOptions.length; j++) {
                    var temp = variantOptions[j].split(':');
                    data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1];
                    data[k]['variants'][i]['option_' + temp[0]] = temp[1];
                    variantOptionArr.push(temp[1]);
                }
                data[k]['variants'][i]['options'] = variantOptionArr;
            }
            data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100;
            data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100;
        }

        // Add Description
        data[k]['description'] = data[k]['body_html'];
    }
    return data;
};

/************************** END BUILD PRODUCT LIST **************************/

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
    // Get page info
    var currentPage = parseInt(this.queryParams.page);
    var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

    // If it has only one page, clear Pagination
    if (totalPage == 1) {
        jQ(this.selector.bottomPagination).html('');
        return false;
    }

    if (this.getSettingValue('general.paginationType') == 'default') {
        var paginationHtml = bcSfFilterTemplate.paginateHtml;

        // Build Previous
        var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
        previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
        paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

        // Build Next
        var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml :  bcSfFilterTemplate.nextDisabledHtml;
        nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
        paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

        // Create page items array
        var beforeCurrentPageArr = [];
        for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
            beforeCurrentPageArr.unshift(iBefore);
        }
        if (currentPage - 4 > 0) {
            beforeCurrentPageArr.unshift('...');
        }
        if (currentPage - 4 >= 0) {
            beforeCurrentPageArr.unshift(1);
        }
        beforeCurrentPageArr.push(currentPage);

        var afterCurrentPageArr = [];
        for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
            afterCurrentPageArr.push(iAfter);
        }
        if (currentPage + 3 < totalPage) {
            afterCurrentPageArr.push('...');
        }
        if (currentPage + 3 <= totalPage) {
            afterCurrentPageArr.push(totalPage);
        }

        // Build page items
        var pageItemsHtml = '';
        var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
        for (var iPage = 0; iPage < pageArr.length; iPage++) {
            if (pageArr[iPage] == '...') {
                pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
            } else {
                pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
            }
            pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
            pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
        }
        paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

        jQ(this.selector.bottomPagination).html(paginationHtml);
    }
};

/************************** BUILD TOOLBAR **************************/

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');

    var sortingArr = this.getSortingList();
    if (sortingArr) {
      // Build content 
      var sortingItemsHtml = '';
      for (var k in sortingArr) { 
        sortingItemsHtml += '<option value="' + k +'">' + sortingArr[k] + '</option>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);      
      jQ(this.selector.topSorting).html(html);

      // Set current value
      jQ(this.selector.topSorting + ' select').val(this.queryParams.sort);
    }
  }
};

// Build Show Limit
BCSfFilter.prototype.buildFilterShowLimit = function() {
    if (bcSfFilterTemplate.hasOwnProperty('showLimitHtml')) {
        jQ(this.selector.topShowLimit).html('');

        var numberList = this.getSettingValue('general.showLimitList');
        if (numberList != '') {
            // Build content
            var showLimitItemsHtml = '';
            var arr = numberList.split(',');
            for (var k = 0; k < arr.length; k++) {
                if (arr[k] == this.queryParams.limit) {
                    showLimitItemsHtml += '<li><a class="utils-showby-item active" href="' + arr[k] +'">' + arr[k] + '</a></li>';
                } else {
                    showLimitItemsHtml += '<li><a class="utils-showby-item" href="' + arr[k] +'">' + arr[k] + '</a></li>';
                }
            }
            var html = bcSfFilterTemplate.showLimitHtml.replace(/{{showLimitItems}}/g, showLimitItemsHtml);
            jQ(this.selector.topShowLimit).html(html);
        }
    }
};

BCSfFilter.prototype.buildShowLimitEvent = function() {
    var _this = this;
    jQ(this.selector.topShowLimit + ' li a').click(function(e) {
        onInteractWithToolbar(e, 'limit', _this.queryParams.limit, jQ(this).attr('href'));
    })
};

/************************** END BUILD TOOLBAR **************************/

// Add additional feature for product list, used commonly in customizing product list
BCSfFilter.prototype.buildExtrasProductList = function(data, eventType) {
    // var sections = new Sections();
    // sections.register('static-collection', function (section) {
    //     return new StaticCollection(section);
    // });
    $("html, body").animate({ scrollTop: 0 }, "slow");
};

// Build additional elements
BCSfFilter.prototype.buildAdditionalElements = function(data, eventType) {
  setTimeout( function(){
    $('.gridReviewTeaser').each(function(){
      var starContainer = $(this);
      var sku = starContainer.attr('data-sku');
      var url = '//static.www.turnto.com/sitedata/bM99ARRH2BRlxZssite/v4_3/'+sku+'/d/itemjs';
      $.getScript(url, function(){
        if(typeof(TurnToItemData) == 'undefined' || typeof(TurnToItemData.counts) == 'undefined') {
        } else {
          var reviewCount = TurnToItemData.counts.r;
          var teaserContainer = starContainer;
          var teaserHtml = '';
          var rating = Math.round((TurnToItemData.counts.ar + 0.25) * 100.0) / 100.0;
          rating = rating.toString();
          var decimal = parseInt(rating.substring(2, 3))
          rating = rating.substring(0, 1) + "-" + (decimal >= 5 ? '5' : '0');
          if(reviewCount == 0) {
            teaserHtml = '<div class="TT2left TTratingBox TTrating-0-0"></div> <span >No review yet</span>';
          } else {
            teaserHtml = '<div class="TTratingBox TTrating-' + rating + '"></div> <span >' + reviewCount + ' Review' + (reviewCount == 1 ? '' : 's') + '</span>';
          }
          teaserContainer.html(teaserHtml);
        }
      });
    });
  },1000);
};

// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
        var colInfo = colData.collection;
        var delimiter = '<span class="breadcrumbs-delimiter" aria-hidden="true"><svg aria-hidden="true" focusable="false" role="presentation" xmlns="http://www.w3.org/2000/svg" width="8" height="5" viewBox="0 0 8 5"><path fill="currentColor" fill-rule="evenodd" d="M1.002.27L.29.982l3.712 3.712L7.714.982 7.002.27l-3 3z"/></svg></span>';
        var breadcrumbHtml = '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> ';
        breadcrumbHtml += delimiter;
        breadcrumbHtml += ' <span>' + colInfo.title + '</span>';
        jQ('.breadcrumbs-container').html(breadcrumbHtml);
    }
};
 
 
BCSfFilter.prototype.buildFilterSelection = function(a) {
    var b = this.buildFilterSelectionData(a);
  $('.bc-sf-filter-result-number').text(a.total_product);
    if ("" !== b) {
        //var c = this.getTemplate("filterRefineWrapper");
      var c = '<div class="{{class.filterRefineWrapper}}"><span class="appliedFilterLbl">Applied Filters:</span> <div class="{{class.filterSelectedItems}}">{{selectedItems}}</div>{{clearAllButton}}</div>';
        c = c.replace(/{{label.refine}}/g, this.getSettingValue("label.refine")), c = c.replace(/{{selectedItems}}/g, b), c = c.replace(/{{clearAllButton}}/g, this.buildClearAllButton()), c = this.buildFilterTreeClass(c);
        for (var d = 1; d <= this.getSettingValue("general.numberFilterTree"); d++) {
            var e = 1 == d ? "" : d;
          $('.appliedFilter').html(c);
          //  this.addFilterTreeItem(c, "before", e)
        }
    } else {
      $('.appliedFilter').html('');
    }
};

BCSfFilter.prototype.buildFilterSelectionData = function() {
    function a(a, b, c, d) {
        return a = a.replace(/{{itemType}}/g, b), a = a.replace(/{{itemLabel}}/g, c), a = a.replace(/{{itemLink}}/g, d)
    }
    var b = this,
        c = "",
  //      d = this.getTemplate("filterRefineItem");
		d = '<div class="selected-item {{class.filterOptionLabel}}"><a href="{{itemLink}}"><span class="selected-type">  <strong>{{itemLabel}}</strong></span><span class="{{class.clearButton}}"></span></a></div>'; 
    return jQ(this.getSelector("filterTree") + " ." + this.class.filterOption).each(function() {
        var e = jQ(this).data("type"),
            f = jQ(this).data("id"),
            g = jQ(this).data("title").trim();
        if (jQ(this).find("a.selected").length > 0) jQ(this).find("a.selected").each(function() {
            if (!b.isCollectionParam(e)) {
                var h = decodeURIComponent(jQ(this).attr("data-value")),
                    i = b.buildClearFilterOptionLink(f, g, h),
                    j = jQ(this).data("title");
                c += a(d, g, j, i)
            }
        });
        else if (jQ(this).find("." + b.class.filterOptionRange + "-slider").hasClass("selected")) {
            var h = jQ(this).find("." + b.class.filterOptionRange + "-slider").attr("data-value");
            if ("" != h) {
                var i = b.buildClearFilterOptionLink(f, g, h),
                    j = h.split(":"),
                    k = j[0] + " - " + j[1];
                if ("price" == e) {
                    var l = b.formatMoney(100 * j[0]),
                        m = b.formatMoney(100 * j[1]);
                    b.getSettingValue("general.removePriceDecimal") && (l = b.removeDecimal(l), m = b.removeDecimal(m)), k = l + " - " + m
                }
                c += a(d, g, k, i)
            }
        }
    }), c
}