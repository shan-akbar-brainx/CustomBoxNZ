//geting price from api for custom box

function convertFormToJSON(form) {
    const array = $(form).serializeArray(); // Encodes the set of form elements as an array of names and values.
    const json = {};
    $.each(array, function () {
      json[this.name] = this.value || "";
    });
    return json;
  }


  $( ".custom-contact-form-submit" ).on("click", function(event){
      
      var errorCount = $('form.custom-product-form').data("errorcount");

      if(!errorCount){
       
        $(".custom-product-form").validate().element("#boxStyle");
        $(".custom-product-form").validate().element("#boardGrade");
        $(".custom-product-form").validate().element("#length");
        $(".custom-product-form").validate().element("#width");
        $(".custom-product-form").validate().element("#height");
        $(".custom-product-form").validate().element("#ContactFormName");
        $(".custom-product-form").validate().element("#ContactFormEmail");
        $(".custom-product-form").validate().element("#ContactFormMessage");

        var formValid = $('form.custom-product-form').valid();
        if(formValid){
          $('#product-main-form').attr('action', '/contact#contact_form');
          $('#boxStyle').attr('name', 'contact[Box Style]');
          $('#boardGrade').attr('name', 'contact[Board Grade]');
          $('#length').attr('name', 'contact[Length]');
          $('#width').attr('name', 'contact[Width]');
          $('#height').attr('name', 'contact[Height]');
          $('#yes').attr('name', 'contact[Include Lid]');
          $('#no').attr('name', 'contact[Include Lid]');
          $('#qty').attr('name', 'contact[Quantity]');

          $('form.custom-product-form').submit();
          localStorage.setItem('contact-form-posted', 'true');
        }

      }else{
        $('html, body').animate({
          scrollTop: $(".wrong-value").offset().top - 300
        }, 1000);
      }   
  });

  async function saveQuoteAPI(quoteObject){
    let responce = await fetch('https://custombox.mediagiant.co.nz/api/v1/quote/save-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        quoteObject: quoteObject
      }),
      mode: 'cors'
    });
    
    return responce;
  }

  async function saveQuote(customerId){
        $('button.custom-save-quote').attr('disabled','true');
        $('button.custom-save-quote').html('<i class="fa fa-spinner fa-spin"></i>');
        //here comes the api link to save quote
        let qty = $("#qty").val();
        let totalPrice = ($("#calculated_price").val() * $("#qty").val()).toFixed(2);
        let discountEnabled = $("#discount_enabled").val();
        let minDiscountValue = Number($("#discount_minimum_quantity").val());
        if(qty >= minDiscountValue && discountEnabled == "true"){
          totalPrice = $("#discounted_price").val();
        }

        let includeLid = $("input[name='properties[includeLid]']:checked").val();
          if(includeLid == "Yes"){
            includeLid = true;
          }else{
            includeLid = false;
          }
        
        let quote = {
          "user_id": customerId,
          "box_style": $("#boxStyle").val(),
          "board_grade": $("#boardGrade").val(),
          "length": $("#length").val(),
          "width": $("#width").val(),
          "height": $("#height").val(),
          "include_lid": includeLid,
          "quantity": $("#qty").val(),
          "unit_price": $("#calculated_price").val(),
          "total_price": totalPrice,
          "discounted_price": $("#discounted_price").val()
        };

        let responce = await saveQuoteAPI(JSON.stringify(quote));
        $('button.custom-save-quote').attr('disabled', false);
        $('button.custom-save-quote').html('Save Quote');
        if(responce.status == 201){
          let savedQuote = await responce.text();
          let parsed_data = JSON.parse(savedQuote);
          $('.save-quote-form-success > a').attr("href", "/account#" + parsed_data._id);
          $('.save-quote-form-success').show();
          setTimeout(function() { $(".save-quote-form-success").fadeOut(1500); }, 5000);
          $(".custom-product-add-to-cart").data("quoteuniqueid", parsed_data.uniqueId);
        }else if(responce.status == 409){
          $('.save-quote-form-error').show();
          $('.save-quote-form-error').text("Error: Quote already saved!!");
          setTimeout(function() { $(".save-quote-form-error").fadeOut(1500); }, 5000);
        }else{
          $('.save-quote-form-error').show();
          $('.save-quote-form-error').text("Error: Some unusual error happened, please try again!");
          setTimeout(function() { $(".save-quote-form-error").fadeOut(1500); }, 5000);
        }
  }
  async function reloadCurrentSelection(){
    let currentSelectionString = localStorage.getItem("currentSelection");

    if(currentSelectionString){
      
      let currentSelection = JSON.parse(currentSelectionString);
      $("#boxStyle").val(currentSelection.boxStyle).change();
      $("#boardGrade").val(currentSelection.boardGrade).change();
      $("#length").val(currentSelection.length).change();
      $("#width").val(currentSelection.width).change();
      $("#height").val(currentSelection.height).change();
      if(currentSelection.includeLid == "Yes"){
        $("#yes").prop("checked", true);  
      }else{
        $("#no").prop("checked", true);
      }
      $("#qty").val(currentSelection.quantity).change();
      $("#calculated_price").val(currentSelection.unitPrice);
      $("#discounted_price").val(currentSelection.discountedPrice);
      await $("#calculate_price").click();
        
      //here comes the api link to save quote
      let redirectUrl =  localStorage.getItem("redirectUrl");
      let customerId = $(".custom-save-quote").data("customerid");  
      if(redirectUrl){

        if(customerId){
          saveQuote(customerId);
        }

      }else{
        if(customerId){
          $(".custom-product-add-to-cart").data("quoteuniqueid", currentSelection.uniqueId);
        }
      }
      localStorage.setItem("currentSelection", "");
      localStorage.setItem("redirectUrl", "");
      $('html, body').animate({
        scrollTop: $(".custom-product-form").offset().top
      }, 1000);
    }
  }
  $( document ).ready(function(){

    reloadCurrentSelection();
    
  });

  $( ".custom-save-quote" ).on("click", async function(event){
    event.preventDefault();
    let customerId = $(this).data("customerid");

    if(customerId){

      saveQuote(customerId);

    }else{
      let includeLid = $("input[name='properties[includeLid]']:checked").val();
      if(includeLid == "Yes"){
        includeLid = true;
      }else{
        includeLid = false;
      }
      let currentSelection = {
        "boxStyle": $("#boxStyle").val(),
        "boardGrade": $("#boardGrade").val(),
        "length": $("#length").val(),
        "width": $("#width").val(),
        "height": $("#height").val(),
        "includeLid": includeLid,
        "quantity": $("#qty").val(),
        "unitPrice": $("#calculated_price").val()
      }
      let currentSelectionString = JSON.stringify(currentSelection);
      localStorage.setItem("currentSelection", currentSelectionString);
      localStorage.setItem("redirectUrl", window.location.pathname);
      window.location.href = "/account/login";
    }
  });

  async function searchQuoteAndSetId(customerId){
    
    let qty = $("#qty").val();
    let totalPrice = ($("#calculated_price").val() * $("#qty").val()).toFixed(2);
    let discountEnabled = $("#discount_enabled").val();
    let minDiscountValue = Number($("#discount_minimum_quantity").val());
    if(qty >= minDiscountValue && discountEnabled == "true"){
      totalPrice = $("#discounted_price").val();
    }
    let includeLid = $("input[name='properties[includeLid]']:checked").val();
      if(includeLid == "Yes"){
        includeLid = true;
      }else{
        includeLid = false;
      }
    

    let quoteObject = {
      "user_id": customerId,
      "box_style": $("#boxStyle").val(),
      "board_grade": $("#boardGrade").val(),
      "length": $("#length").val(),
      "width": $("#width").val(),
      "height": $("#height").val(),
      "include_lid": includeLid,
      "quantity": $("#qty").val(),
      "unit_price": $("#calculated_price").val(),
      "total_price": totalPrice
    };

    const { user_id, box_style, board_grade, length, width, height, include_lid, quantity, unit_price, total_price } = quoteObject;
    let unique_id = user_id.toString() + box_style + board_grade + length.toString() + width.toString() + height.toString() + 
      include_lid.toString() + quantity.toString() + unit_price.toString() + total_price.toString();
      let responce = await fetch('https://custombox.mediagiant.co.nz/api/v1/quote/find-single-quote/' + unique_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if(responce.status == 200){
        $(".custom-product-add-to-cart").data("quoteuniqueid", unique_id);
      }
      return responce;
  }
 
  $( ".custom-product-submit" ).on( "click", async function( event ) {

    let boxStyleValidate = $(".custom-product-form").validate().element("#boxStyle");
    let boardGradeValidate = $(".custom-product-form").validate().element("#boardGrade");
    let lengthValidate = $(".custom-product-form").validate().element("#length");
    let widthValidate = $(".custom-product-form").validate().element("#width");
    let heightValidate = $(".custom-product-form").validate().element("#height");
    
    
    if(boxStyleValidate && boardGradeValidate && lengthValidate && widthValidate && heightValidate){
      
      var errorCount = $('form.custom-product-form').data("errorcount");
      if(!errorCount){
        $('p.price-error-message').html('');
        $('p.general-error-message').html('');
        $('button.custom-product-submit').attr('disabled','true');
        $('button.custom-product-submit').html('<i class="fa fa-spinner fa-spin"></i>');
        $(".total-original-price").hide();
        $(".discount-badge").hide();
        var value = convertFormToJSON($('form.custom-product-form'));
        var stringifiedData = JSON.stringify(value);
        stringifiedData = stringifiedData.replaceAll("properties[","");
        stringifiedData = stringifiedData.replaceAll("]","");
        try{
          let responce = await $.ajax({
            type: "POST",
            url: "https://custombox.mediagiant.co.nz/api/v1/custom-box/get-price?shop=customboxnz.myshopify.com",
            headers: {
              'Content-Type':'application/json'
            },
            dataType: 'json',
            data: stringifiedData
          });
          
          
          if((responce.totalRate != false && responce.totalRate != "false") && (responce.totalRate != 0 && responce.totalRate != null)){

            var calculatedUnitPrice = (responce.totalRate/value.quantity).toFixed(2);

            $("#calculated_price").val(calculatedUnitPrice);
            let customerId = $(".custom-save-quote").data("customerid");
            if(customerId){
              await searchQuoteAndSetId(customerId);
            }

            $(".unit-custom-price").html("$" + calculatedUnitPrice + " + GST");

            if(responce.isDiscountEnabled && responce.discountPercentage){

              let discounted_price = (calculatedUnitPrice*value.quantity).toFixed(2)*(1 - responce.discountPercentage/100);
              $(".total-custom-price").html("$" + (discounted_price).toFixed(2) + " + GST");
              $(".total-original-price").show();
              $(".total-original-price").html("$" + (calculatedUnitPrice*value.quantity).toFixed(2));
              $(".discount-badge").show();
              $(".discount-badge").html(responce.discountPercentage + "% off, " + responce.discountMinimumQuantity + " quantity discount.");
              $("#discounted_price").val(discounted_price.toFixed(2));
              
              
            }else{
              
              $(".total-custom-price").html("$" + (calculatedUnitPrice*value.quantity).toFixed(2) + " + GST");

            }
              $("#discount_percent_applied").val(responce.discountPercentage);
              $("#discount_percent_amount").val(responce.quantityDiscountPercentage);
              $("#discount_minimum_quantity").val(responce.discountMinimumQuantity);
              $("#discount_enabled").val(responce.isDiscountEnabled);

            $('button.custom-product-submit').attr('disabled', false);
            $('button.custom-product-submit').html('Calculate Price');
            $(".actions").removeClass("display-hidden");
            $(".custom-save-quote-button-wrapper").removeClass("display-hidden");
            
            
          }else{
            $('button.custom-product-submit').attr('disabled', false);
            $('button.custom-product-submit').html('Calculate Price');
            if(responce.totalRate == 0 || responce.totalRate == null ){
              $('p.general-error-message').html("The dimensions entered do not fit the size of the board. <br> Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
            }else{
              $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
            }

          }
        }catch(error){
          $('button.custom-product-submit').attr('disabled', false);
          $('button.custom-product-submit').html('Calculate Price');
          $('p.general-error-message').html("Some unusual error happened, please try again.");
        }

      }else{
        event.preventDefault();
        $('html, body').animate({
          scrollTop: $(".wrong-value").offset().top - 300
        }, 1000);
      }
    }else{
      event.preventDefault();
    }
    
  });

  $('select.box-style').change(function(){
    restoreToDefault();
    onOptionsChange();
    boxStyleChange();
  });

  function boxStyleChange(){
    var selectedStyle = $('select.box-style').val();
    if(selectedStyle){
      var maxLength = null;
      var minLength = null;
      var maxWidth = null;
      var minWidth = null;
      var maxHeight = null;
      var minHeight = null;
      if(selectedStyle == 'RSC'){
        maxLength = null;
        minLength = 65;
        maxWidth = 1000;
        minWidth = 40;
        maxHeight = 1500;
        minHeight = 55;
        $(".include-lid-field").addClass("display-hidden");
      }else if(selectedStyle == 'HSC'){
        maxLength = null;
        minLength = 65;
        maxWidth = 1000;
        minWidth = 40;
        maxHeight = 1500;
        minHeight = 55;
        $(".include-lid-field").removeClass("display-hidden");
        $("input#no").prop("checked", true);
      }else if(selectedStyle == 'FOLF'){
        maxLength = null;
        minLength = 65;
        maxWidth = 500;
        minWidth = 20;
        maxHeight = 1500;
        minHeight = 55;
        $(".include-lid-field").addClass("display-hidden");
      }else if(selectedStyle == 'B&L'){
        maxLength = null;
        minLength = 130;
        maxWidth = 1500;
        minWidth = 55;
        maxHeight = 500;
        minHeight = 65;
        $(".include-lid-field").removeClass("display-hidden");
        $("input#yes").prop("checked", true);
      }else if(selectedStyle == '5PF'){
        maxLength = 1500;
        minLength = 100;
        maxWidth = null;
        minWidth = 75;
        maxHeight = 500;
        minHeight = 20;
        $(".include-lid-field").addClass("display-hidden");
      }
      $("label.custom-length-field-label").html("Length mm");
      $("label.custom-width-field-label").html("Width mm");
      $("label.custom-height-field-label").html("Depth mm");
      if(selectedStyle){
        //length
        $("input.custom-length-field").data("min", minLength);
        $("input.custom-length-field").data("max", maxLength);
        if(maxLength == null){
          $("label.custom-length-field-label").html("Length mm <span>(Minimum Length: " + minLength + ")</span>");
        }else{
          $("label.custom-length-field-label").html("Length mm <span>(" + minLength + " - " + maxLength + ")</span>"); 
        }

        //width
        $("input.custom-width-field").data("min", minWidth);
        $("input.custom-width-field").data("max", maxWidth);
        if(maxWidth == null){
          $("label.custom-width-field-label").html("Width mm <span>(Minimum Width: " + minWidth + ")</span>");
        }else{
          $("label.custom-width-field-label").html("Width mm <span>(" + minWidth + " - " + maxWidth + ")</span>"); 
        }
        //height
        $("input.custom-height-field").data("min", minHeight);
        $("input.custom-height-field").data("max", maxHeight);
        if(maxHeight == null){
          $("label.custom-height-field-label").html("Depth mm <span>(Minimum Depth: " + minHeight + ")</span>");
        }else{
          $("label.custom-height-field-label").html("Depth mm <span>(" + minHeight + " - " + maxHeight + ")</span>"); 
        } 
      }
    }else{
      $("label.custom-length-field-label").html("Length mm");
      $("label.custom-width-field-label").html("Width mm");
      $("label.custom-height-field-label").html("Depth mm"); 
    }
  }

  function lengthChangeFunction(){
    if($('select.box-style').val()){
      onOptionsChange();
      var min = parseInt($("input.custom-length-field").data("min"));
      var max = parseInt($("input.custom-length-field").data("max"));
      var value = parseInt($("input.custom-length-field").val());
      $('p.length-error-message').html('');
      if((value < parseInt($('input.custom-width-field').val())) || value < min || value > max){
        if(value < parseInt($('input.custom-width-field').val())){
          $('p.length-error-message').html('Length must be equal to or greater than the width');
        }
        if(value < min){
          $('p.length-error-message').html($('p.length-error-message').html() + '<br>' + 'Minimum length should be ' + min + ' mm.');
        }
        if(value > max){
          $('p.length-error-message').html($('p.length-error-message').html() + '<br>' + 'Length should not be greater then ' + max + ' mm.');
        }
        if(!$('input.custom-length-field').hasClass('wrong-value')){
          $('input.custom-length-field').addClass('wrong-value');
          $('form.custom-product-form').addClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount += 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 1){
            $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
          }
        }
      }else{ 
        if($('input.custom-length-field').hasClass('wrong-value')){
          $('p.length-error-message').html('');
          $('input.custom-length-field').removeClass('wrong-value');
          $('form.custom-product-form').removeClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount -= 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 0){
            $('p.general-error-message').html('');
          }
        }
      }
    }
  }

  function widthChangeFunction(){
    if($('select.box-style').val()){
      onOptionsChange();
      var min = parseInt($("input.custom-width-field").data("min"));
      var max = parseInt($("input.custom-width-field").data("max"));
      var value = parseInt($("input.custom-width-field").val());
      $('p.width-error-message').html('');
      if((value > parseInt($('input.custom-length-field').val())) || value < min || value > max){
        if(value > parseInt($('input.custom-length-field').val())){
          $('p.width-error-message').html('The width must be less than or equal to the length');
        }
        if(value < min){
          $('p.width-error-message').html($('p.width-error-message').html() + '<br>'+'Minimum width should be ' + min + ' mm.');
        }
        if(value > max){
          $('p.width-error-message').html($('p.width-error-message').html() + '<br>'+'Width should not be greater than ' + max + ' mm.');
        }
        if(!$('input.custom-width-field').hasClass('wrong-value')){
          $('input.custom-width-field').addClass('wrong-value');
          $('form.custom-product-form').addClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount += 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 1){
            $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
          }
        }
      }else{
        if($('input.custom-width-field').hasClass('wrong-value')){
          $('p.width-error-message').html('');
          $('input.custom-width-field').removeClass('wrong-value');
          $('form.custom-product-form').removeClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount -= 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 0){
            $('p.general-error-message').html('');
          }
      }
      }

      if($('select.box-style').val() == '5PF'){
        var height_value = parseInt($('input.custom-height-field').val());
        height_value = height_value || 0;
        if((parseInt($("input.custom-width-field").val()) < height_value) || (parseInt($("input.custom-width-field").val()) + height_value) < 200 ){
          if(parseInt($("input.custom-width-field").val()) < height_value){
            $('p.width-error-message').html($('p.width-error-message').html() + '<br>'+'The width must be greater than or equal to the depth.');
          }

          if((parseInt($("input.custom-width-field").val()) + height_value) < 200){
            $('p.width-error-message').html($('p.width-error-message').html() + '<br>' + 'The combined width and depth must be greater than or equal to 200mm.');
          }
          if(!$('input.custom-width-field').hasClass('wrong-value')){
            $('input.custom-width-field').addClass('wrong-value');
            $('form.custom-product-form').addClass('has-error');
            var errorCount = $('form.custom-product-form').data("errorcount");
            errorCount += 1;
            $('form.custom-product-form').data("errorcount", errorCount);
            if(errorCount == 1){
              $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
            }
          }
        }else{
          if($('input.custom-width-field').hasClass('wrong-value')){
            $('p.width-error-message').html('');
            $('input.custom-width-field').removeClass('wrong-value');
            $('form.custom-product-form').removeClass('has-error');
            var errorCount = $('form.custom-product-form').data("errorcount");
            errorCount -= 1;
            $('form.custom-product-form').data("errorcount", errorCount);
            if(errorCount == 0){
              $('p.general-error-message').html('');
            }
          }
        }
      }
    }  
  }

 function heightChangeFunction(){
  if($('select.box-style').val()){
    onOptionsChange();
    var min = parseInt($("input.custom-height-field").data("min"));
    var max = parseInt($("input.custom-height-field").data("max"));
    var value = parseInt($("input.custom-height-field").val());
    $('p.height-error-message').html('');
    if(value < min || value > max){
      if(value < min){
        $('p.height-error-message').html('Minimum Depth should be ' + min + ' mm.');
      }
      if(value > max){
        $('p.height-error-message').html('Depth should not be greater then ' + max + ' mm.');
      }
      if(!$('input.custom-height-field').hasClass('wrong-value')){
        $('input.custom-height-field').addClass('wrong-value');
        $('form.custom-product-form').addClass('has-error');
        var errorCount = $('form.custom-product-form').data("errorcount");
        errorCount += 1;
        $('form.custom-product-form').data("errorcount", errorCount);
        if(errorCount == 1){
          $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
        }
      }
    }else{
      if($('input.custom-height-field').hasClass('wrong-value')){
        $('p.height-error-message').html('');
        $('input.custom-height-field').removeClass('wrong-value');
        $('form.custom-product-form').removeClass('has-error');
        var errorCount = $('form.custom-product-form').data("errorcount");
        errorCount -= 1;
        $('form.custom-product-form').data("errorcount", errorCount); 
        if(errorCount == 0){
          $('p.general-error-message').html('');
        }
      }
    }
    if($('select.box-style').val() == 'B&L'){
      var lengthHalf = parseInt(parseInt($('input.custom-length-field').val()) * 0.5);
      if(parseInt($("input.custom-height-field").val()) > lengthHalf || value < min || value > max){
        if(parseInt($("input.custom-height-field").val()) > lengthHalf){
          $('p.height-error-message').html('The depth must be less than half the length');
        }
        if(value < min){
          $('p.height-error-message').html($('p.height-error-message').html()+'<br>'+'Minimum Depth should be ' + min + ' mm.');
        }
        if(value > max){
          $('p.height-error-message').html($('p.height-error-message').html()+'<br>'+'Depth should not be greater then ' + max + ' mm.');
        }

        if(!$('input.custom-height-field').hasClass('wrong-value')){
          $('input.custom-height-field').addClass('wrong-value');
          $('form.custom-product-form').addClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount += 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 1){
            $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
          }
        }
      }else{
        if($('input.custom-height-field').hasClass('wrong-value')){
          $('p.height-error-message').html('');
          $('input.custom-height-field').removeClass('wrong-value');
          $('form.custom-product-form').removeClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount -= 1;
          $('form.custom-product-form').data("errorcount", errorCount);
          if(errorCount == 0){
            $('p.general-error-message').html('');
          }
        }
      }
    }
      if($('select.box-style').val() == '5PF'){
        if(value < 75){
          $('p.height-note-message').html('NOTE: If the required depth is less than 75mm then we can produce a product down to a minimum of 20mm, however the flaps will join in the middle and not on the side. Please contact us if this is not suitable.');
        }else{
          $('p.height-note-message').html('');
        }
        $('p.height-error-message').html('');
        if((parseInt($("input.custom-height-field").val()) > parseInt($('input.custom-width-field').val())) || ((parseInt($("input.custom-height-field").val()) + parseInt($('input.custom-width-field').val())) < 200) || value < min || value > max){
          if(parseInt($("input.custom-height-field").val()) > parseInt($('input.custom-width-field').val())){
            $('p.height-error-message').html('The depth must be less than or equal to width');
          }
          if((parseInt($("input.custom-height-field").val()) + parseInt($('input.custom-width-field').val())) < 200){
            $('p.height-error-message').html('The combined width and depth must be greater than or equal to 200mm.' + '<br>' + $('p.height-error-message').html());
          }

          if(value > max){
            $('p.height-error-message').html($('p.height-error-message').html()+'<br>'+'Depth should not be greater then ' + max + ' mm.');
          }

          if(value < min){
            $('p.height-error-message').html($('p.height-error-message').html()+'<br>'+'Minimum Depth should be ' + min + ' mm.');
          }

          if(!$('input.custom-height-field').hasClass('wrong-value')){
            $('input.custom-height-field').addClass('wrong-value');
            $('form.custom-product-form').addClass('has-error');
            var errorCount = $('form.custom-product-form').data("errorcount");
            errorCount += 1;
            $('form.custom-product-form').data("errorcount", errorCount);
            if(errorCount == 1){
              $('p.general-error-message').html("Don't give up! <br> We may be able to produce boxes outside these specifications. <br>Please contact <br> <span class='custombox-text'> sales@custombox.co.nz </span> or telephone us on <span class='custombox-text'>0508 334 466.</span>");
            }
          }
        }else{
          if($('input.custom-height-field').hasClass('wrong-value')){
            $('p.height-error-message').html('');
            $('input.custom-height-field').removeClass('wrong-value');
            $('form.custom-product-form').removeClass('has-error');
            var errorCount = $('form.custom-product-form').data("errorcount");
            errorCount -= 1;
            $('form.custom-product-form').data("errorcount", errorCount);
            if(errorCount == 0){
              $('p.general-error-message').html('');
            }
          }
        }
      }
    }
 }

  $('input.custom-input-field').change(function(){

    lengthChangeFunction();
    widthChangeFunction();
    heightChangeFunction();

  });

  $('input.custom-quantity-field').change(function(){
    $('p.quantity-error-message').html('');
    $(".tooltip-message").hide();
    onOptionsChange();
    var value = parseInt($(this).val());
    
    if((value < 1 || isNaN(value) || value > 250)){
      if(value < 1 || isNaN(value)){
        $('p.quantity-error-message').html('Please enter the correct quantity value.');
        if(!$('input.custom-quantity-field').hasClass('wrong-value')){
          $('input.custom-quantity-field').addClass('wrong-value');
          $('form.custom-product-form').addClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount += 1;
          $('form.custom-product-form').data("errorcount", errorCount);
        }
      }

    }else{
      $('#product-main-form').attr('action', '/cart/add');
      $('#boxStyle').attr('name', 'properties[boxStyle]');
      $('#boardGrade').attr('name', 'properties[boardGrade]');
      $('#length').attr('name', 'properties[length]');
      $('#width').attr('name', 'properties[width]');
      $('#height').attr('name', 'properties[height]');
      $('#yes').attr('name', 'properties[includeLid]');
      $('#no').attr('name', 'properties[includeLid]');
      $('#qty').attr('name', 'quantity');
      $('.custom-contact-form-wrapper').hide();
      $('.custom-button-wrapper').show();
      $('.total-custom-price-wrapper').show();
      $('.unit-custom-price-wrapper').show();
      if($('input.custom-quantity-field').hasClass('wrong-value')){
        $('p.quantity-error-message').html(''); 
        $('input.custom-quantity-field').removeClass('wrong-value');
        $('form.custom-product-form').removeClass('has-error');
        var errorCount = $('form.custom-product-form').data("errorcount");
        errorCount -= 1;
        $('form.custom-product-form').data("errorcount", errorCount);
      }
    }

  });

  $('select.board-grade').change(function(){
    onOptionsChange();
  });

  function onOptionsChange(){
    $("#calculated_price").val("");
    $("#discounted_price").val("");
    $("#discount_percent_applied").val("");
    $("#discount_percent_amount").val("");
    $("#discount_minimum_quantity").val("");
    $("#discount_enabled").val("");
    $(".unit-custom-price").html("$__");
    $(".total-custom-price").html("$__");
    $(".custom-product-add-to-cart").data("quoteuniqueid", "");
    $(".total-original-price").hide();
    $(".discount-badge").hide();
    $(".actions").addClass("display-hidden");
    $(".custom-save-quote-button-wrapper").addClass("display-hidden");
    localStorage.setItem("customBoxDimentions", "");
  } 

  function restoreToDefault(){

    $('input.custom-length-field').val('');
    $('input.custom-length-field').removeClass('wrong-value');
    $('p.length-error-message').html('');
    $('input.custom-width-field').val('');
    $('input.custom-width-field').removeClass('wrong-value');
    $('p.width-error-message').html('');
    $('input.custom-height-field').val('');
    $('input.custom-height-field').removeClass('wrong-value');
    $('p.height-error-message').html('');
    $('input.custom-quantity-field').val('1');
    $('input.custom-quantity-field').removeClass('wrong-value');
    $('p.quantity-error-message').html(''); 
    $('p.general-error-message').html('');
    $('form.custom-product-form').data("errorcount", 0);
    $('form.custom-product-form').removeClass('has-error');

    //contact form restore
    $('#product-main-form').attr('action', '/cart/add');
    $('#boxStyle').attr('name', 'properties[boxStyle]');
    $('#boardGrade').attr('name', 'properties[boardGrade]');
    $('#length').attr('name', 'properties[length]');
    $('#width').attr('name', 'properties[width]');
    $('#height').attr('name', 'properties[height]');
    $('#yes').attr('name', 'properties[includeLid]');
    $('#no').attr('name', 'properties[includeLid]');
    $('#qty').attr('name', 'quantity');
    $('.custom-contact-form-wrapper').hide();
    $('.custom-button-wrapper').show();
    $('.total-custom-price-wrapper').show();
    $('.unit-custom-price-wrapper').show();
  }

  $('.shopify-challenge__button').click(function(){
    localStorage.setItem('contact-form-posted', 'true');
  });

  $("#ContactFormDeliver").change(function(){
    
    let deliveryType = $(this).val();
    if(deliveryType == "deliver"){
      $(".custom-contact-form-field__address").css('display', 'flex');
      $("#ContactFormAddress").attr('name', 'contact[address]');
    }else{
      $("#ContactFormAddress").attr('name', 'address');
      $(".custom-contact-form-field__address").hide();
    }

  });

  $(".tooltip-message").click(function(){
    let includeLid = "No";
        if($("#yes").is(':checked')){
          includeLid = "Yes";
        }
        let customBoxDimentions = {
          "boxStyle": $("#boxStyle").val(),
          "boardGrade": $("#boardGrade").val(),
          "length": $("#length").val(),
          "width": $("#width").val(),
          "height": $("#height").val(),
          "includeLid": includeLid,
          "quantity": $("#qty").val()
        }

        localStorage.setItem("customBoxDimentions", JSON.stringify(customBoxDimentions));
        window.open("/pages/contact");
  });

  $(document).ready(function(){
    localStorage.setItem("customBoxDimentions", "");
    var contactFormPosted = localStorage.getItem('contact-form-posted');
    if(contactFormPosted == 'true'){
      $('.custom-contact-form-success').show();
      setTimeout(function() { $(".custom-contact-form-success").fadeOut(1500); }, 5000);
      localStorage.setItem('contact-form-posted', 'false');
    }
  });