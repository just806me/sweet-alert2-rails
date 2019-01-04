var sweetAlertConfirmConfig = sweetAlertConfirmConfig || {}; // Add default config object

(function ($) {
  var defaultOptions = {
    title: 'Are you sure?',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'Cancel'
  };

  var optionKeys = [
    'text',
    'showCancelButton',
    'confirmButtonColor',
    'cancelButtonColor',
    'confirmButtonText',
    'cancelButtonText',
    'html',
    'imageUrl',
    'allowOutsideClick',
    'customClass'
  ];

  function onConfirmed($element) {
    var element = $element.get()[0];

    if ($element.data().remote === true) {
      var event = 'seet-alert2-rails:handleRemote';

      element.addEventListener(event, $.rails.handleRemote, { once: true });

      element.dispatchEvent(new Event(event));
    }
    else if ($element.data().method !== undefined) {
      var event = 'seet-alert2-rails:handleMethod';

      element.addEventListener(event, $.rails.handleMethod, { once: true });

      element.dispatchEvent(new Event(event));
    }
    else if ($element.attr('type') == 'submit')
      $element.closest('form').submit();
    else
      $element.data('swal-confirmed', true).click();
  }

  function onClick() {
    var $element = $(this);

    var options = Object.assign({}, defaultOptions, sweetAlertConfirmConfig);

    if ($element.data('swal-confirmed')) {
      $element.data('swal-confirmed', false);

      return true;
    }

    $.each($element.data(), function (key, val) {
      if (optionKeys.includes(key))
        options[key] = val;
    });

    if ($element.data('sweet-alert-type'))
      options['type'] = $element.data('sweet-alert-type');

    if ($element.data('sweet-alert-confirm'))
      options['title'] = $element.data('sweet-alert-confirm');

    swal(options).then(function (result) {
      if (result.value)
        onConfirmed($element);
    });

    return false;
  }

  $(document).on('ready turbolinks:load page:update ajaxComplete', function () {
    $('[data-sweet-alert-confirm]').on('click', onClick)
  });

  $(document).on('ready turbolinks:load page:load', function () {
    //To avoid "Uncaught TypeError: Cannot read property 'querySelector' of null" on turbolinks
    if (typeof window.sweetAlertInitialize === 'function') {
      window.sweetAlertInitialize();
    }
  });
})(jQuery);
