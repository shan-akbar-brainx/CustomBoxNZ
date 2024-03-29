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
          var boxStyleValidation = $(".custom-product-form").validate().element("#boxStyle");
          var boxGradeValidation = $(".custom-product-form").validate().element("#boardGrade");
          var boxLengthValidation = $(".custom-product-form").validate().element("#length");
          var boxWidthValidation = $(".custom-product-form").validate().element("#width");
          var boxHeightValidation = $(".custom-product-form").validate().element("#height");
          $(".custom-product-form").validate().element("#ContactFormName");
          $(".custom-product-form").validate().element("#ContactFormEmail");
          $(".custom-product-form").validate().element("#ContactFormMessage");
        
          var formValid = $('form.custom-product-form').valid();
        if(formValid){
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
        }else{
          if( !boxStyleValidation || !boxGradeValidation || !boxLengthValidation || !boxWidthValidation || !boxHeightValidation){
            $('html, body').animate({
              scrollTop: $("#product-main-form").offset().top - 300
            }, 1000);
          }
          
        }
     
      }else{
        $('html, body').animate({
          scrollTop: $(".wrong-value").offset().top - 300
        }, 1000);
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
    $(".custom-contact-form-wrapper").hide();
    lengthChangeFunction();
    widthChangeFunction();
    heightChangeFunction();

  });

  $('input.custom-quantity-field').change(function(){
    $('p.quantity-error-message').html('');
    onOptionsChange();
    var value = parseInt($(this).val());
    if(value < 1 ){
      
        $('p.quantity-error-message').html('Please enter the correct quantity value.');
        if(!$('input.custom-quantity-field').hasClass('wrong-value')){
          $('input.custom-quantity-field').addClass('wrong-value');
          $('form.custom-product-form').addClass('has-error');
          var errorCount = $('form.custom-product-form').data("errorcount");
          errorCount += 1;
          $('form.custom-product-form').data("errorcount", errorCount);
        }
      

    }else{
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
    $(".unit-custom-price").html("$__");
    $(".total-custom-price").html("$__");
    $(".custom-contact-form-wrapper").hide();
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

    //contact form hide
    $(".custom-contact-form-wrapper").hide();
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


  $(document).ready(function(){
    var contactFormPosted = localStorage.getItem('contact-form-posted');
    if(contactFormPosted == 'true'){
      $('.custom-contact-form-success').show();
      setTimeout(function() { $(".custom-contact-form-success").fadeOut(1500); }, 5000);
      localStorage.setItem('contact-form-posted', 'false');
    }
  });