(function() { // Form validation script
    'use strict'

    bsCustomFileInput.init() // Any custom file input on the page will be initialized with very basic JS functionality
    
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => { // Makes an array out of forms and calls forEach on it.
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()