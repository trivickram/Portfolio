let menuIcon = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menuIcon.onclick = () => {
  menuIcon.classList.toggle("bx-x");
  navbar.classList.toggle("active");
};

let selections = document.querySelectorAll("section");
let navlinks = document.querySelectorAll("header nav a");

window.onscroll = () => {
  selections.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 100;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navlinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("header nav a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
  let header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 100);

  menuIcon.classList.remove("bx-x");
  navbar.classList.remove("active");
};

const form = document.getElementById("dataForm");document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevents page refresh

    var Username = document.getElementById("name").value;
    var Email = document.getElementById("email").value;
    var MobileNumber = document.getElementById("number").value;
    var Subject = document.getElementById("subject").value;
    var Message = document.getElementById("message").value;

    var templateParams = {
        user_name: Username,
        user_email: Email,
        user_number: MobileNumber,
        subject: Subject,
        message: Message,
    };

    // Send Contact Email
    emailjs.send("service_af0c8xr", "template_dnb2u7s", templateParams)
        .then(function(response) {
            alert("Email Sent Successfully!");
            console.log("SUCCESS!", response.status, response.text);

            // Auto-reply email after the first one succeeds
            var autoReplyParams = {
                user_name: Username,
                to_email: Email, // This should be mapped in your EmailJS template
                subject: "Thank you for contacting us!",
                message: "We have received your message and will get back to you soon."
            };

            return emailjs.send("service_af0c8xr", "template_i88yszn", autoReplyParams);
        })
        .then(function(response) {
            alert("Your message has been sent. You will receive an auto-reply shortly!");
            console.log("Auto-reply sent!", response.status, response.text);
        })
        .catch(function(error) {
            console.error("Failed to send email or auto-reply", error);
        });
});
