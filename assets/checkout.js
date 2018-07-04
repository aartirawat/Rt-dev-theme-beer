var APP_URL = 'https://nb-gift-cards.herokuapp.com';

$(document).ready(function() {
  $("body").bind("submit", ".order-summary__section--discount form", gc_validate);
  $("body").bind("focus", ".order-summary__section--discount #checkout_reduction_code", build_gc_pin);
  build_gc_pin();
});


function build_gc_pin()
{
  var gc_enable = true;
  $("[data-product-type]").each(function() {
    if($(this).data('productType').toLowerCase() == "gift card")
    {
      gc_enable = false;
      return false;
    }
  });
    
  if(!gc_enable && $(".checkout-message").length == 0)
  {
    var checkout_message = '<p class="checkout-message field__message field__message--error" id="msg-for-checkout-message">Please note that gift cards cannot be redeemed for orders containing gift card products.</p>';
    $("#checkout_reduction_code").closest("form").prepend(checkout_message);
    $(".checkout-message").show();
    gc_pin_elem = '<input value="8888888" type="hidden" name="checkout[reduction_pin]" id="checkout_reduction_pin">';
    $(".order-summary__section--discount form").first().append(gc_pin_elem);
  }
  else if(gc_enable && $("#checkout_reduction_pin").length == 0)
  {
    var gc_pin_elem = '<div class="fieldset">';
    gc_pin_elem += '<div class="field">';
    gc_pin_elem += '<div class="field__input-btn-wrapper">';
    gc_pin_elem += '<div class="field__input-wrapper"><label class="field__label field__label--visible" for="checkout_reduction_pin">Gift card pin #</label>';
    gc_pin_elem += '<input style="width:30%;" placeholder="Gift card pin #" class="field__input" data-discount-field="true" autocomplete="off" aria-required="true" size="30" type="text" name="checkout[reduction_pin]" id="checkout_reduction_pin">';
    gc_pin_elem += '<p style="margin-top:5px;" class="field__message">Only required for gift cards.</p>';
    gc_pin_elem += '</div></div></div></div>';
    $(".order-summary__section--discount form").last().append(gc_pin_elem);
  }
}

function gc_validate()
{        
  checkout_loader(false);
  if($(this).find("#checkout_reduction_code").length == 0) return true;
  
  var current_gc = jQuery.trim($(this).find("#checkout_reduction_code").val()),
  current_gc_pin = jQuery.trim($(this).find("#checkout_reduction_pin").val()),
  gc_validated = $(this).find("#checkout_reduction_code").attr('gcvt');

  if(current_gc == "" || current_gc_pin == "" || (typeof gc_validated != "undefined"))
    return true;
  else
  {
    checkout_loader(true);
    $("#checkout_reduction_code").attr('gcvt',1);
    $.ajax({
      type: "GET",
      url: APP_URL + "/gift_cards/checkout/" + current_gc + "/" + current_gc_pin,
      success: gift_card_checkout,
      error: gift_card_checkout_error,
      dataType: "json"
    });
    
    return false;
  }
}

function checkout_loader(enable)
{
  $(".checkout-gc-error").remove();
  if(enable && $(".checkout-loader").length > 0)
    $(".checkout-loader").show();
  else if (enable)
  {
    var checkout_loader = '<p class="checkout-loader field__message field__message--error" id="msg-for-checkout-loader">One moment. Validating Gift Card/Discount Code...</p>';
    $("#checkout_reduction_code").closest("form").append(checkout_loader);
    $(".checkout-loader").show();
  }
  else
    $(".checkout-loader").hide();
}

function gift_card_checkout(resp)
{
  if(typeof resp.shop_gc != "undefined")
  {
    if(resp.pin_default)
    {
      checkout_loader(false);
      gift_card_checkout_error(resp);
    }
    else
    {
    	$("#checkout_reduction_code").val(resp.shop_gc);
	    $("#checkout_reduction_code").closest("form").find("button[type=submit]").first().click();
    }
  }
  else
    gift_card_checkout_error(resp);
}

function gift_card_checkout_error(resp)
{
  var gc_error = '<p class="checkout-gc-error field__message field__message--error" id="msg-for-checkout-gc-error">Unable to apply gift card.</p>';
  $("#checkout_reduction_code").closest("form").append(gc_error);
  $(".checkout-gc-error").show();
}
