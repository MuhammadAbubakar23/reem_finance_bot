

/*!
   * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
   * Copyright 2011-2024 The Bootstrap Authors
   * Licensed under the Creative Commons Attribution 3.0 Unported License.
   */
(() => {
  'use strict'

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto') {
      document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = themeSwitcherText.querySelector('i') // Get the icon inside the button

    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    if (!btnToActive) {
      return
    }

    // Set the button icon based on the selected theme
    if (theme === 'light') {
      activeThemeIcon.className = 'fa-light fa-sun-bright' // Set to sun icon
    } else if (theme === 'dark') {
      activeThemeIcon.className = 'fa-light fa-moon' // Set to moon icon
    }

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')

    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



document.getElementById("active1").addEventListener("click", function() {
  document.getElementById("chatitem1").classList.toggle("d-none");
  this.classList.toggle("active");
  document.querySelectorAll(".empty").forEach(function(el) {
    el.classList.add("d-none");
  });
});

document.getElementById("active2").addEventListener("click", function() {
  document.getElementById("chatitem2").classList.toggle("d-none");
  this.classList.toggle("active");
  document.querySelector(".chatbot-main").classList.toggle("secondactive");
  document.querySelectorAll(".empty").forEach(function(el) {
    el.classList.add("d-none");
  });
});

document.getElementById("active3").addEventListener("click", function() {
  document.getElementById("chatitem3").classList.toggle("d-none");
  this.classList.toggle("active");
  document.querySelector(".botleft").classList.toggle("thirdactive");
  document.querySelector(".chatbot-main").classList.toggle("thirdactive");
  document.querySelectorAll(".empty").forEach(function(el) {
    el.classList.add("d-none");
  });
});

  //Sidebar Toggle
  if (document.querySelectorAll(".panelToggle").length) {
    document.querySelectorAll(".panelToggle").forEach(function(panelToggle) {
      panelToggle.addEventListener("click", function() {
        document.body.classList.remove("leftactive");
        document.querySelectorAll(".chat-message-component").forEach(function(chatMessage) {
          chatMessage.classList.remove("panelToggled");
        });

        var leftSidebarExpand = document.getElementById("left-sidebar-expand");
        if (leftSidebarExpand.classList.contains("toggled")) {
          document.body.classList.add("leftactive");
          leftSidebarExpand.classList.remove("toggled");
        } else {
          leftSidebarExpand.classList.add("toggled");
        }
      });
    });
  }

  var leftSidebarExpand = document.getElementById("left-sidebar-expand");

  if (leftSidebarExpand.classList.contains("toggled")) {
    document.body.classList.remove("leftactive");
  } else {
    document.body.classList.add("leftactive");
  }

//   $(".e-bot-icon").on("click", function() {
//     $(this).toggleClass("active");
//     $(".enteract-chatbot").toggleClass("active");
//     $(".enteract-chatbot").removeClass("removebot");
//   });
//   $(".ebotclose").on("click", function() {
//     $(".e-bot-icon").removeClass("active");
//     $(".enteract-chatbot").removeClass("active");
//     $(".enteract-chatbot").addClass("removebot");
//   });

//   $(".showbots").on("click", function() {
//     $('.chatbotshow').toggleClass("d-none");
//   });




// $("#minbutton").on("click", function() {
//   $('#chatitem1').toggleClass("minimized");
// });
// $("#minbutton2").on("click", function() {
//   $('#chatitem2').toggleClass("minimized");
// });

// $("#minbutton3").on("click", function() {
//   $('#chatitem3').toggleClass("minimized");
// });

// $(".newapi-btn").on("click", function() {
//   $('#googleaction').addClass("d-none");
//   $('#apiaction').removeClass("d-none");
//   $('#emailaction').addClass("d-none");
//   $('#resetaction').addClass("d-none");

// });



  // Click event listener for the openkbinner button
document.querySelector(".openkbinner").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent default action of anchor tag

  // Remove 'd-none' from kbinner to show it
  document.getElementById("kbinner").classList.remove("d-none");

  // Hide the knowledgebase section
  document.getElementById("knowledgebase").classList.add("d-none");
});

// Click event listener for the openkb button inside kbinner
document.querySelector(".openkb").addEventListener("click", function() {

  // Add 'd-none' to kbinner to hide it
  document.getElementById("kbinner").classList.add("d-none");

  // Show the knowledgebase section
  document.getElementById("knowledgebase").classList.remove("d-none");
});



function toggleNavPanel() {
  var element = document.getElementById("left-sidebar-expand");
  element.classList.toggle("toggled");
}
function changeTheme(color) {
  "use strict";
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);
  const setTheme = (theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  };

  const showActiveTheme = (theme) => {
    const btnToActive = document.querySelector(
      `[data-bs-theme-value="${theme}"]`
    );
    if (!btnToActive) {
      return;
    }

    document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
      element.classList.remove("active");
      element.setAttribute("aria-pressed", "false");
    });

    btnToActive.classList.add("active");
    btnToActive.setAttribute("aria-pressed", "true");
  };

  // Set the theme based on the passed color
  setStoredTheme(color);
  setTheme(color);
  showActiveTheme(color);
}