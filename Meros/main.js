/* =================================================
   EMAILJS INITIALIZATION
   ================================================= */
(function () {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: "VFOlcr26fn2MPqXYK",
        });
    }
})();

/* =================================================
   1. BOOKING FORM LOGIC
   ================================================= */
function initBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Formaning standart yuborilishini to'xtatish

            const form = event.target;

            // NEW: Validate Room Selection
            const qtyInputs = [
                form.querySelector('[name="qty_double"]'),
                form.querySelector('[name="qty_twin"]'),
                form.querySelector('[name="qty_triple"]'),
                form.querySelector('[name="qty_double_balcony"]'),
                form.querySelector('[name="qty_twin_balcony"]')
            ];

            let totalRooms = 0;
            qtyInputs.forEach(input => {
                if (input) totalRooms += parseInt(input.value || "0");
            });

            if (totalRooms === 0) {
                const lang = localStorage.getItem('selectedLang') || 'en';
                const roomAlertMsg = translations[lang]?.['form.alert_select_room'] || translations['en']['form.alert_select_room'];

                // Show Error
                alert(roomAlertMsg);

                // Highlight section (optional visual cue)
                const roomSection = form.querySelector('.room-selection-group');
                if (roomSection) {
                    roomSection.style.border = "2px solid red";
                    roomSection.style.padding = "10px";
                    roomSection.scrollIntoView({ behavior: "smooth", block: "center" });

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        roomSection.style.border = "none";
                        roomSection.style.padding = "";
                    }, 3000);
                }
                return; // Stop execution
            }

            // Forma ma'lumotlarini EmailJS shabloni uchun yig'ish (templateParams)
            const templateParams = {
                // Aloqa va Asosiy Ma'lumotlar
                full_name: form.querySelector('[name="fullName"]').value,
                email: form.querySelector('[name="email"]').value,
                check_in: form.querySelector('[name="checkInDate"]').value,
                check_out: form.querySelector('[name="checkOutDate"]').value,
                phone_number: form.querySelector('[name="phoneNumber"]').value || 'Kiritilmagan',
                adults: form.querySelector('[name="adults"]').value,
                children: form.querySelector('[name="children"]').value,
                additional_notes: form.querySelector('[name="additionalNotes"]').value || 'Yo\'q',

                // Xona Buyurtmasi
                qty_double: form.querySelector('[name="qty_double"]')?.value || "0",
                qty_twin: form.querySelector('[name="qty_twin"]')?.value || "0",
                qty_triple: form.querySelector('[name="qty_triple"]')?.value || "0",
                qty_double_balcony: form.querySelector('[name="qty_double_balcony"]')?.value || "0",
                qty_twin_balcony: form.querySelector('[name="qty_twin_balcony"]')?.value || "0",
            };

            // EmailJS xizmati orqali yuborish
            emailjs.send('service_n4nb5ob', 'template_59tfqm9', templateParams)
                .then(function (response) {
                    console.log('SUCCESS!', response.status, response.text);
                    const lang = localStorage.getItem('selectedLang') || 'en';
                    alert(translations[lang]?.['form.success'] || translations['en']['form.success']);
                    form.reset();
                }, function (error) {
                    console.log('FAILED...', error);
                    const lang = localStorage.getItem('selectedLang') || 'en';
                    alert(translations[lang]?.['form.error'] || translations['en']['form.error']);
                });
        });
    }
}

/* =================================================
   2. MOBILE MENU LOGIC (Hamburger)
   ================================================= */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        // Toggle menu click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Clickni "tashqariga" o'tib ketishini oldini oladi
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('nav-open');
        });

        // Ekranning ixtiyoriy joyiga bosganda menyuni yopish
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('nav-open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('nav-open');
            }
        });

        // Menyudagi birorta link bosilsa ham menyuni yopish (UX uchun)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('nav-open');
            });
        });
    }
}/* =================================================
   3. CUSTOM SELECT LOGIC
   ================================================= */
function initCustomSelects() {
    const quantityControls = document.querySelectorAll('.quantity-control');

    quantityControls.forEach((control) => {
        const select = control.querySelector('select');
        if (!select) return;

        // Asl selectni yashirish
        select.style.display = 'none';

        // Custom select container (wrap)
        const customSelectDiv = document.createElement("div");
        customSelectDiv.setAttribute("class", "custom-select");
        control.appendChild(customSelectDiv);

        // Tanlangan elementni ko'rsatuvchi div (trigger)
        const selectSelected = document.createElement("div");
        selectSelected.setAttribute("class", "select-selected");
        selectSelected.innerHTML = select.options[select.selectedIndex].innerHTML;
        customSelectDiv.appendChild(selectSelected);

        // Variantlar ro'yxati (dropdown items)
        const selectItems = document.createElement("div");
        selectItems.setAttribute("class", "select-items select-hide");

        for (let i = 0; i < select.length; i++) {
            /* Har bir option uchun bittadan div yaratamiz */
            const optionDiv = document.createElement("div");
            optionDiv.innerHTML = select.options[i].innerHTML;

            // Agar option tanlangan bo'lsa, stil berish uchun
            if (select.selectedIndex == i) optionDiv.setAttribute("class", "same-as-selected");

            optionDiv.addEventListener("click", function (e) {
                /* Variant tanlanganda: */
                const s = select;
                const h = selectSelected;

                for (let i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        const y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (let k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        // O'zgarishni bildirish (change event)
                        s.dispatchEvent(new Event('change'));
                        break;
                    }
                }
                h.click(); // Ro'yxatni yopish
            });
            selectItems.appendChild(optionDiv);
        }
        customSelectDiv.appendChild(selectItems);

        // Click hodisasi: Ochish/Yopish
        selectSelected.addEventListener("click", function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    });

    function closeAllSelect(elmnt) {
        /* Barcha ochiq dropdownlarni yopish, joriy elementdan tashqari */
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /* Agar foydalanuvchi tashqariga bossa, dropdownlarni yopish */
    document.addEventListener("click", closeAllSelect);
}

/* =================================================
   4. GALLERY & LIGHTBOX LOGIC
   ================================================= */
function initGallery() {
    // --- 1. FILTERING LOGIC ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add to clicked
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hide');
                        // Fade in animation effect
                        item.style.opacity = '0';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }

    // --- 3. URL PARAMETER HANDLING (NEW) ---
    // Check if there is a 'filter' query parameter (e.g. gallery.html?filter=tours)
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {
        // Find the button with this filter
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
        if (targetBtn) {
            // Trigger click
            targetBtn.click();
        }
    }

    // --- 2. ENHANCED LIGHTBOX LOGIC ---
    // Check if lightbox already exists (from HTML or previous injection)
    let lightbox = document.getElementById('lightbox');

    // Create Lightbox if it doesn't exist
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        document.body.appendChild(lightbox);

        // Add internal structure
        lightbox.innerHTML = `
            <div id="lightbox-close">&times;</div>
            <div class="lightbox-prev">&#10094;</div>
            <img src="" alt="Zoomed Image">
            <div class="lightbox-next">&#10095;</div>
        `;
    }

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = document.querySelector('#lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentIndex = 0;
    let visibleImages = []; // Array of currently visible elements

    // Helper to update visible images list (based on filter)
    function updateVisibleImages() {
        // Select all images that are NOT hidden (respects filters)
        // Also includes images from other pages like rooms/restaurant if they have the right class
        const galleryImgs = Array.from(document.querySelectorAll('.gallery-item:not(.hide) img'));
        const otherImgs = Array.from(document.querySelectorAll('.main-room-image, .gallery-image, .menu-item-card img'));

        // Combine them
        visibleImages = [...galleryImgs, ...otherImgs];
    }

    // Bind Click Events to Images
    const allPotentialImages = document.querySelectorAll('.gallery-item img, .main-room-image, .gallery-image, .menu-item-card img');

    allPotentialImages.forEach(img => {
        img.style.cursor = 'pointer'; // Ensure pointer cursor
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('a')) e.preventDefault(); // Stop links

            updateVisibleImages(); // Refresh list to get current state

            // Find index of clicked image in our visible list
            currentIndex = visibleImages.indexOf(img);
            if (currentIndex === -1) currentIndex = 0; // Fallback

            openLightbox(visibleImages[currentIndex].src);
        });
    });

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Enable scroll
    }

    function showNext() {
        if (visibleImages.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleImages.length;
        updateLightboxImage();
    }

    function showPrev() {
        if (visibleImages.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        lightboxImg.style.opacity = '0.5';
        setTimeout(() => {
            lightboxImg.src = visibleImages[currentIndex].src;
            lightboxImg.style.opacity = '1';
        }, 150);
    }

    // Event Listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

/* ================================================= */
/* === LANGUAGE TRANSLATION LOGIC (i18n) === */
/* ================================================= */

const translations = {
    en: {
        "nav.home": "Home",
        "nav.rooms": "Accommodation",
        "nav.tours": "Tours",
        "nav.restaurant": "Rooftop Dining",
        "nav.gallery": "Gallery",
        "nav.admin": "Admin",

        // DINING PAGE
        "dining.hero_title": "Rooftop Dining Experience",
        "dining.hero_subtitle": "Enjoy traditional Uzbek cuisine with a panoramic view of the Old City.",
        "dining.view_menu": "View Menu",
        "menu.title": "Our Menu",

        // GALLERY PAGE
        "gallery.title": "Our Gallery",
        "gallery.subtitle": "Moments captured in the heart of Khiva",
        "gallery.grid_title": "Explore Meros",

        // GALLERY FILTERS
        "filter.all": "All",
        "filter.rooms": "Rooms",
        "filter.dining": "Dining",
        "filter.tours": "Tours",
        "filter.exterior": "Exterior",

        // CONTACT / BOOKING PROMPT
        "contact.book_title": "Ready to Book?",
        "contact.book_desc": "To book this tour or ask questions, please contact us directly via WhatsApp, Telegram, or Email.",

        // HOME PAGE (index.html)
        "home.hero_title": "Welcome to Meros B&B Khiva",
        "about_main.title": "About MEROS B&B",
        "about_main.p1": "Dear guests, welcome to the MEROS B&B. The MEROS B&B is located inside the baked mud walls of ancient Khiva, not far from the western & northern gates. The guest house started welcoming guests in 1999. MEROS means 'cultural heritage' in English, and the Matkarimov's family is steeped in Uzbek culture. Their great-great-grandfather Said Arbob was a master artisan (usto in Uzbek) engaged by the Khivan Khans.",
        "about_main.p2": "Saadulla Matkarimov (1936-1993) father of the owner Kuranbay Matkarimov, worked for more than 20 years on the restoration of Khiva during the Soviet Union. Kuranbay Matkarimov (1957-2018), was a master of pattern design and restoration. He worked on restoration projects in the World Heritage centres of Khiva, Bukhara and Shaxrisabz. He was chief restorer of the decorated ceilings of Khiva. The ceilings in the MEROS guest rooms and verandahs are painted in this classical Khorezmian style.",
        "map.full_address": "<strong>Meros B&B</strong><br>A. Boltaev Street 57, Ichan Kala<br>Khiva, Uzbekistan",
        "footer.copyright": "© " + new Date().getFullYear() + " Meros B&B. All Rights Reserved.",

        // ROOM DETAILS GENERICS
        "detail.price_prefix": "Price:",
        "detail.book_now": "Send Request",
        "detail.features_title": "Features",
        "feature.bed_double": "1 Double Bed",
        "feature.bed_twin": "2 Single Beds",
        "feature.bed_triple": "3 Single Beds",
        "feature.wifi": "Free Wi-Fi",
        "feature.bathroom": "Private Bathroom + Hairdryer",
        "feature.ac": "Air Conditioning",
        "feature.fridge": "Mini Fridge",
        "feature.breakfast": "Breakfast Included",
        "feature.balcony": "Private Balcony",
        "detail.desc_double": "This room distinguishes itself with comfort and traditional design. Decorated in the spirit of Khiva architecture, it offers you home-like coziness.",
        "detail.desc_twin": "The Twin room offers guests two comfortable single beds and a traditional setting. Perfect for friends or colleagues traveling together.",

        // HERO SECTIONS
        "hero.title": "Authentic Experience in the Heart of Khiva",
        "hero.subtitle": "Stay within the ancient walls of Ichan Kala and feel the spirit of history.",
        "hero.btn": "View Rooms",
        "about.title": "Our services",
        "about.text": "MEROS B&B offers 9 air conditioned rooms with private bathroom, delicious uzbek cuisine, and easy access to historical attractions, air/train tickets online booking, tours exscursions organization, transfers from/to Airport/Train station, rooftop terrace for sunset/sunrise, free wifi and free parking around the house.",
        "reviews.title": "What Our Guests Say",
        "reviews.subtitle": "Real experiences from travelers around the world",
        "reviews.write_title": "Write a Review",
        "reviews.label_name": "Your Name",
        "reviews.label_rating": "Rating",
        "reviews.label_comment": "Your Review",
        "reviews.label_photo": "Attach Photo",
        "reviews.btn_submit": "Submit Review",
        "reviews.alert_success": "Thank you for your comment!",
        "reviews.alert_error": "Error sending review. Please try again.",
        "map.title": "Find Us Here",
        "map.address": "Inside the Old City Walls",

        // FAQ SECTION
        "faq.title": "Frequently Asked Questions",
        "faq.q1": "Is breakfast included?",
        "faq.a1": "Yes, a delicious traditional buffet breakfast is included in the price. Time: 07:30 - 10:00.",
        "faq.q2": "Do you offer airport transfer?",
        "faq.a2": "Yes, we can arrange private transfers from Urgench Airport or Train Station for an extra fee.",
        "faq.q3": "What are the check-in and check-out times?",
        "faq.a3": "Check-in from 14:00, Check-out until 12:00. Early check-in is subject to availability.",
        "faq.q4": "What free services do you offer?",
        "faq.a4": "Wi-Fi, Welcome Drink, Luggage Porter, Train & Flight Ticket Booking Assistance.",

        // ROOMS PAGE
        "rooms.hero_title": "Our Rooms",
        "rooms.hero_subtitle": "Comfort and tradition combined",
        "rooms.double_title": "Double Room",
        "rooms.double_desc": "Perfect for couples. Includes a large double bed, private bath, and AC.",
        "rooms.twin_title": "Twin Room",
        "rooms.twin_desc": "Ideal for friends. Two separate single beds with all modern amenities.",
        "rooms.triple_title": "Triple Room",
        "rooms.triple_desc": "Great for small families or groups. Three beds and spacious area.",
        "rooms.twin_balcony_title": "Twin Balcony Room",
        "rooms.twin_balcony_desc": "Enjoy the view from your private balcony. Two beds, modern facilities.",
        "rooms.double_balcony_title": "Double Balcony Room",
        "rooms.double_balcony_desc": "Romantic double room with a private balcony overlooking the city.",
        "rooms.double_single_title": "Double Room (Single Use)",
        "rooms.twin_single_title": "Twin Room (Single Use)",
        "rooms.double_balcony_single_title": "Double Room w/ Balcony (Single Use)",
        "rooms.twin_balcony_single_title": "Twin Room w/ Balcony (Single Use)",
        "rooms.view_details": "View Details",

        // TOURS PAGE
        "tours.hero_title": "Discover Khiva & Beyond",
        "tours.hero_subtitle": "Exclusive tours curated for you",
        "tours.section_title": "Our Exclusive Tours",
        "tours.section_subtitle": "Book your unforgettable adventures around Khiva and Uzbekistan.",
        "tours.khiva_title": "Khiva City Tour",
        "tours.khiva_desc": "Explore ancient Ichan Kala with a professional guide. Visit minarets, madrasahs, and museums.",
        "tours.aral_title": "Aral Sea Adventures",
        "tours.aral_desc": "Two-day trip to the Muynak Ship Graveyard and Aral Sea ecotourism sites.",
        "tours.castles_title": "Desert Castles (Ellik Kala)",
        "tours.castles_desc": "Visit the ancient fortresses of Toprak Kala, Ayaz Kala, and Kyzyl Kala in the desert.",
        "tours.transfer_tour_desc": "Comfortable transport to visit ancient fortresses of Khorezm.",
        "tours.view_details": "View Details",

        // TOUR CARDS (tours.html)
        "tours.card_day_title": "Day Trips",
        "tours.card_day_desc": "Special one-day trips to ancient fortresses and pilgrimage sites around Khiva.",
        "tours.card_transfer_title": "Transfers",
        "tours.card_transfer_desc": "Comfortable and safe private transfer services from the airport/train station to the hotel.",
        "tours.card_aral_title": "Aral Sea Adventures",
        "tours.card_aral_desc": "Two-day trip to the Muynak Ship Graveyard and Aral Sea ecotourism sites.",
        "tours.card_khiva_title": "Khiva Walking Tour",
        "tours.card_khiva_desc": "Discover the historical and cultural heritage of Ichan Kala with a qualified guide.",
        "tours.btn_book": "Request Service",
        "tours.btn_view": "View Details",
        "tours.view_gallery": "View Gallery",

        // ARAL SEA TOUR DETAILS (aral_sea.html)
        "tour_aral.title": "Aral Sea Adventures",
        "tour_aral.subtitle": "Choose your expedition to the edge of the world",
        "tour_aral.section_title": "Khiva - Moynaq - Khiva (1 Day Tour)",
        "tour_aral.desc": "This long day trip covers the ecological disaster zone and key cultural landmarks including the famous Nukus Art Museum.",
        "tour_aral.details_title": "Tour Details & Highlights:",
        "tour_aral.route_label": "Route:",
        "tour_aral.route_text": "Chilpik Dakhma - Nukus Museum - Aral Sea Museum - Ship Cemetery - Mizdakhan Necropolis.",
        "tour_aral.start_time": "Recommended Start: 06:00 AM (Early start is essential).",
        "tour_aral.duration": "Total Duration: Approx. 14-16 hours.",
        "tour_aral.driving_time": "Driving Time: 9-10 hours.",
        "tour_aral.mizdakhan": "Mizdakhan Necropolis: Ancient burial complex dating back to 9th century.",
        "tour_aral.nukus": "Nukus Museum: Famous for its Soviet Avant-garde collection.",
        "tour_aral.price": "Sedan Price (1-3 pax): $110.",
        "tour_aral.logistics_label": "Logistics:",
        "tour_aral.logistics_text": "Driver, car (AC), fuel & water included. Lunch is typically arranged in Nukus.",

        // ARAL SEA OPTIONS
        "aral.options_title": "Aral Sea Tour Options",
        "aral.options_desc": "We offer four unique variations of the Aral Sea expedition.",
        "aral.label_route": "Route:",
        "aral.label_duration": "Duration:",
        "aral.label_sightseeing": "Sightseeing time:",
        "aral.label_driving": "Driving time:",
        "aral.label_included": "Included:",
        "aral.label_start": "Start:",
        "aral.label_not_included": "Not included:",
        "aral.read_more": "Read More",
        "aral.intro_happy": "We are happy to offer this tour!!!",
        "aral.history_intro": "Once one of the largest inland lakes in the world, the Aral Sea has shrunk significantly in recent decades. Located in Central Asia, it borders Kazakhstan in the north and Uzbekistan in the south. Historically, the Aral Sea has been an important source of water and fish for the surrounding areas, but since the 1960s, it has been drying up due to the diversion of the rivers that fed it, particularly the Amudarya and Syrdarya, for irrigation purposes during the Soviet era. As a result, the water level of the Aral Sea dropped sharply and its volume decreased by almost 90%.",
        "aral.itinerary": "Itinerary",
        "aral.day_1": "1st Day",
        "aral.day_2": "2nd Day",
        "aral.notes_title": "Notes for Visitors",
        "aral.booking_desc": "To book any of these options, please contact us directly. Mention \"Option 1, 2, 3 or 4\".",

        "aral.note_drivers": "Drivers will stop at sightseeing places for you to take photos.",
        "aral.note_mobile": "Mobile devices, cameras, and camcorders may be recharged at the yurt camp.",
        "aral.note_cold": "It is cold at the seashore in the mornings and evenings. Bring a sweater or a jacket.",
        "aral.note_illness": "If you have any chronic illnesses, don’t forget your medication.",
        "aral.note_water": "Always carry water with you.",
        "aral.note_guide": "Stay close to your guide and your vehicle.",
        "aral.note_cliff": "Stay at least 2 meters away from the edge of the Ustyurt Plateau.",
        "aral.note_excluded_val": "Entrance tickets, lunch, guide ($150) & etc.",

        // Prices for Aral Sea Options
        "price.1pax_500": "1 Pax: $500",
        "price.2pax_540": "2 Pax: $540",
        "price.3pax_580": "3 Pax: $580",
        "price.4pax_620": "4 Pax: $620",

        // Option 3 Prices (fixed to match key names)
        "price.1pax_550": "1 Pax: $550",
        "price.2pax_590": "2 Pax: $590",
        "price.3pax_630": "3 Pax: $630",
        "price.4pax_670": "4 Pax: $670",

        // Option 2 Prices (New)
        "price.opt2_1pax": "1 Pax: $580",
        "price.opt2_2pax": "2 Pax: $620",
        "price.opt2_3pax": "3 Pax: $660",
        "price.opt2_4pax": "4 Pax: $700",

        "price.1pax_470": "1 Pax: $470",
        "price.2pax_510": "2 Pax: $510",
        "price.3pax_550": "3 Pax: $550",
        "price.4pax_590": "4 Pax: $590",

        // Option 4 Prices (New)
        "price.opt4_1pax": "1 Pax: $490",
        "price.opt4_2pax": "2 Pax: $530",
        "price.opt4_3pax": "3 Pax: $570",
        "price.opt4_4pax": "4 Pax: $610",

        // Option 1
        "aral.opt1_title": "Option 1: Aral Sea Adventure (Classic)",
        "aral.opt1_route_text": "Khiva - Chilpik Kala - Nukus Museum - Muynak History Museum - Muynak Ship Cemetery - Great Ustyurt Canyons - Tombs of Nomads' - Aral Sea shore overnight - Kurgancha Kala - Mizdakhan Necropolis - Nukus - Khiva",
        "aral.opt1_dur_val": "2 days and 1 night",
        "aral.opt1_sight_val": "6-8 hours",
        "aral.opt1_drive_val": "16-18 hours",
        "aral.opt1_inc_val": "Transportation (4WD & Sedan w/ driver), Yurt Camp Stay, Dinner & Breakfast.",
        "aral.opt1_start_val": "06:00 am (Recommended)",
        "aral.opt1_d1_1": "It is recommended to Start early morning at 6:00 am. Starts and ends in Khiva with sedan car.",
        "aral.opt1_d1_2": "Visit to Chilpik Kala.",
        "aral.opt1_d1_3": "Nukus Art museum.",
        "aral.opt1_d1_4": "Arrival in Muynak, lunch at the local kafe.",
        "aral.opt1_d1_5": "Muynak state local history museum, and watching a video about the history of the once-thriving Muynak.",
        "aral.opt1_d1_6": "Visit to the ship Graveyard.",
        "aral.opt1_d1_7": "Starts Aral Sea trip with a 4WD.",
        "aral.opt1_d1_8": "Overview of the impressive canyons of the Ustyurt Plateau, a cosmic landscape, visit to the tombs of nomads.",
        "aral.opt1_d1_9": "Arrival to the Aral Sea about 18:30. Stroll along the seashore, guests can swim in the sea.",
        "aral.opt1_d1_10": "Arrival at the yurt camp on the shores of the Aral Sea. The camp has a shower with clean fresh water and a restroom.",
        "aral.opt1_d1_11": "19:30 dinner in dining room and next day breakfast 7:00.",
        "aral.opt1_d2_1": "Do not miss the sunrise over the Aral sea.",
        "aral.opt1_d2_2": "7:00 Breakfast.",
        "aral.opt1_d2_3": "8:00 departure for the return journey.",
        "aral.opt1_d2_4": "Visit to Kurgancha-kala (XII-XVI centuries) a fortified trading post on the Great Silk Road.",
        "aral.opt1_d2_5": "Arrive to Muynak and change 4WD car to sedan car and stop for lunch on the way in local kafe.",
        "aral.opt1_d2_6": "Visit architectural complex Mizdakhan Necropolis from XIV century.",
        "aral.opt1_d2_7": "And come back to Khiva (if you want Nukus, Urgench, airport) the end.",

        // Option 2
        "aral.opt2_title": "Option 2: Aral Sea & Sudochie (Extended)",
        "aral.opt2_route_text": "Khiva - Chilpik Kala - Nukus Museum - Muynak History Museum - Muynak Ship Cemetery - Great Ustyurt Canyons - Tombs of Nomads' - Aral Sea shore overnight - Kurgancha Kala - Kubla Ustyurt, Sudochie Lake Urga - Mizdakhan Necropolis - Nukus - Khiva",
        "aral.opt2_dur_val": "2 days and 1 night",
        "aral.opt2_sight_val": "6-8 hours",
        "aral.opt2_drive_val": "16-18 hours",
        "aral.opt2_inc_val": "Transportation (4WD & Sedan w/ driver), Yurt Camp Stay, Dinner & Breakfast.",
        "aral.opt2_start_val": "06:00 am (Recommended)",
        "aral.opt2_d1_1": "It is recommended to Start early morning at 6:00 am. Starts and ends in Khiva with sedan car.",
        "aral.opt2_d1_2": "Visit to Chilpik Kala.",
        "aral.opt2_d1_3": "Nukus Art museum.",
        "aral.opt2_d1_4": "Starts and ends from Nukus with a 4WD.",
        "aral.opt2_d1_5": "Arrival in Muynak, lunch at the local kafe.",
        "aral.opt2_d1_6": "Muynak state local history museum, and watching a video about the history of the once-thriving Muynak.",
        "aral.opt2_d1_7": "Visit to the ship Graveyard.",
        "aral.opt2_d1_8": "Overview of the impressive canyons of the Ustyurt Plateau, a cosmic landscape, visit to the tombs of nomads.",
        "aral.opt2_d1_9": "Arrival to the Aral Sea about 18:30. Stroll along the seashore, guests can swim in the sea.",
        "aral.opt2_d1_10": "Arrival at the yurt camp on the shores of the Aral Sea. The camp has a shower with clean fresh water and a restroom.",
        "aral.opt2_d1_11": "19:30 dinner In dining room and next day breakfast 7:00.",
        "aral.opt2_d2_1": "Do not miss the sunrise over the Aral sea.",
        "aral.opt2_d2_2": "7:00 Breakfast.",
        "aral.opt2_d2_3": "8:00 departure for the return journey.",
        "aral.opt2_d2_4": "Visit to Kurgancha-kala (XII-XVI centuries).",
        "aral.opt2_d2_5": "Visit to the village of Kubla-Ustyurt (abandoned Soviet town).",
        "aral.opt2_d2_6": "Urga (abandoned fishing village) on Sudochie Lake.",
        "aral.opt2_d2_7": "The \"Sudochie\" State Ornithological Reserve (Bird watching, flamingos, etc.).",
        "aral.opt2_d2_8": "Visit architectural complex Mizdakhan Necropolis.",
        "aral.opt2_d2_9": "Arrive to Nukus and change 4WD car to sedan car and come back to Khiva (or Nukus/Urgench airport) the end.",

        // Option 3
        "aral.opt3_title": "Option 3: Aral Sea Adventure (via Kungrad)",
        "aral.opt3_route_text": "Khiva - Chilpik Kala - Nukus Museum - Muynak History Museum - Muynak Ship Cemetery - Great Ustyurt Canyons - Tombs of Nomads' - Aral Sea shore overnight - Kurgancha Kala - Kubla Ustyurt, Sudochie Lake, Urga - Mizdakhan Necropolis - Nukus - Khiva",
        "aral.opt3_dur_val": "2 days and 1 night",
        "aral.opt3_sight_val": "6-8 hours",
        "aral.opt3_drive_val": "16-18 hours",
        "aral.opt3_inc_val": "Transportation (4WD & Sedan w/ driver), Yurt Camp Stay, Dinner & Breakfast.",
        "aral.opt3_d1_1": "It is recommended to Start early morning at 6:00 am. Starts and ends in Khiva with sedan car.",
        "aral.opt3_d1_2": "Visit to Chilpik Kala.",
        "aral.opt3_d1_3": "Nukus Art museum.",
        "aral.opt3_d1_4": "Arrival in Muynak lunch at the local kafe.",
        "aral.opt3_d1_5": "Starts from Muynak with a 4WD.",
        "aral.opt3_d1_6": "Muynak state local history museum, and watching a video about the history of the once-thriving Muynak.",
        "aral.opt3_d1_7": "Visit to the ship Graveyard.",
        "aral.opt3_d1_8": "Overview of the impressive canyons of the Ustyurt Plateau, a cosmic landscape, visit to the tombs of nomads.",
        "aral.opt3_d1_9": "Arrival to the Aral Sea about 18:30. Stroll along the seashore, guests can swim in the sea.",
        "aral.opt3_d1_10": "Arrival at the yurt camp on the shores of the Aral Sea. The camp has a shower with clean fresh water and a restroom.",
        "aral.opt3_d1_11": "About 19:30 dinner In dining room and next day breakfast about 7:00.",
        "aral.opt3_d2_1": "Do not miss the sunrise over the Aral sea.",
        "aral.opt3_d2_2": "7:00 Breakfast.",
        "aral.opt3_d2_3": "8:00 departure for the return journey.",
        "aral.opt3_d2_4": "Visit to Kurgancha-kala (XII-XVI centuries).",
        "aral.opt3_d2_5": "Visit to the village of Kubla-Ustyurt.",
        "aral.opt3_d2_6": "Urga (fishing village remains).",
        "aral.opt3_d2_7": "\"Sudochie\" State Ornithological Reserve.",
        "aral.opt3_d2_8": "Visit architectural complex Mizdakhan Necropolis.",
        "aral.opt3_d2_9": "Arrive to Kungrad and change 4WD car to sedan car and come back to Khiva (or Nukus/Urgench airport) the end.",

        // Option 4
        "aral.opt4_title": "Option 4: Nukus to Aral Sea (4WD Only)",
        "aral.opt4_route_text": "Nukus - Mizdakhan Necropolis - Muynak History Museum - Muynak Ship Cemetery - Great Ustyurt Canyons - Tombs of Nomads' - Aral Sea shore overnight - Kurgancha Kala - Kubla Ustyurt - Sudochie Lake - Urga - Nukus",
        "aral.opt4_dur_val": "2 days and 1 night",
        "aral.opt4_sight_val": "6-8 hours",
        "aral.opt4_drive_val": "12-14 hours",
        "aral.opt4_inc_val": "Transportation (4WD w/ driver), Yurt Camp Stay, Dinner & Breakfast.",
        "aral.opt4_start_val": "06:00 am (Recommended)",
        "aral.opt4_d1_1": "Starts from Nukus with a 4WD.",
        "aral.opt4_d1_2": "Visit architectural complex Mizdakhan Necropolis.",
        "aral.opt4_d1_3": "Arrival in Muynak, lunch at the local kafe.",
        "aral.opt4_d1_4": "Muynak state local history museum, and watching a video about the history of the once-thriving Muynak.",
        "aral.opt4_d1_5": "Visit to the ship Graveyard.",
        "aral.opt4_d1_6": "Overview of the impressive canyons of the Ustyurt Plateau, a cosmic landscape, visit to the tombs of nomads.",
        "aral.opt4_d1_7": "Arrival to the Aral Sea, Stroll along the seashore, guests can swim in the sea.",
        "aral.opt4_d1_8": "Arrival at the yurt camp on the shores of the Aral Sea. The camp has a shower with clean fresh water and a restroom.",
        "aral.opt4_d1_9": "19:30 dinner and next day breakfast 7:00.",
        "aral.opt4_d2_1": "Do not miss the sunrise over the Aral sea.",
        "aral.opt4_d2_2": "7:00 Breakfast.",
        "aral.opt4_d2_3": "8:00 departure for the return journey.",
        "aral.opt4_d2_4": "Visit to Kurgancha-kala (XII-XVI centuries).",
        "aral.opt4_d2_5": "Visit to the village of Kubla-Ustyurt.",
        "aral.opt4_d2_6": "Urga (fishing village remains).",
        "aral.opt4_d2_7": "\"Sudochie\" State Ornithological Reserve.",
        "aral.opt4_d2_8": "Arrive to Nukus the end.",


        // KHIVA TOUR DETAILS
        "tour_khiva.title": "Khiva City Tour",
        "tour_khiva.subtitle": "Unlock the secrets of the Open Air Museum",
        "tour_khiva.section_title": "Magic of Ichan-Kala: Full Day Program",
        "tour_khiva.desc": "Immerse yourself in the atmosphere of the Silk Road. This curated walking tour covers all the major landmarks of the UNESCO World Heritage site Ichan-Kala.",
        "tour_khiva.highlights_title": "Walking Tour Highlights:",
        "tour_khiva.highlight_1": "Kalta Minor Minaret & Muhammad Amin Khan Madrasah.",
        "tour_khiva.highlight_2": "Juma Mosque (Friday Mosque) with its unique wooden pillars.",
        "tour_khiva.highlight_3": "Kunya Ark (Old Citadel) and Tash-Hauli Palace.",
        "tour_khiva.booking_note": "Booking:",
        "tour_khiva.booking_info": "Qualified local guide service available upon request. Guide service is payable separately (approx $70вЂ“$80).",

        // KHIVA TOUR PROGRAM (NEW)
        "khiva.program_title": "PROGRAM",
        "khiva.morning_title": "MORNING: Legends of the Khans (09:00 - 13:00)",
        "khiva.morning_1": "09:00: Meet your guide at the hotel. Start the tour at the Western Gate (Ota Darvoza).",
        "khiva.morning_2": "Kalta Minor Minaret: The iconic unfinished blue tower.",
        "khiva.morning_3": "Muhammad Amin Khan Madrasah & Minaret: The largest medieval madrasah in Central Asia.",
        "khiva.morning_4": "Kunya Ark Citadel: The ancient fortress within a fortress.",
        "khiva.afternoon_1": "Juma Mosque: A masterpiece of wood carving with 213 unique wooden columns.",
        "khiva.afternoon_2": "Pakhlavan Mahmud Mausoleum: The most sacred site in Khiva.",
        "khiva.afternoon_3": "Islam Khodja Madrasah & Minaret: The tallest minaret in Khiva.",
        "khiva.price_title": "Tour Price",
        "khiva.price_desc": "This is a private guided tour. The price is per group, not per person.",
        "khiva.price_val": "$50 (Guide Service)",


        // FORTRESS DAY TRIPS (private_day.html)
        "tour_day.title": "The Ancient Fortresses of Khorezm Tour",
        "tour_day.subtitle": "Explore the Ellik Kala region, known for the remains of thousands of ancient fortresses and palaces.",
        "tour_day.section_title": "Khiva Fortress Day Trips",
        "tour_day.desc": "Choose the best option for your time and historical curiosity. All tours begin and end at your hotel in Khiva. Starting time is flexible (09:00 - 16:00).",
        "tour_day.table_name": "Tour Name",
        "tour_day.table_fortresses": "Key Fortresses Visited",
        "tour_day.table_duration": "Duration",
        "tour_day.table_price_sedan": "Sedan (1-3 pax)",
        "tour_day.table_price_suv": "SUV (1-4 pax)",
        "tour_day.table_price_minivan": "Minivan (4-6 pax)",
        "tour_day.3_fortresses": "Three Fortresses Tour",
        "tour_day.5_fortresses": "Five Fortresses Tour",
        "tour_day.7_fortresses": "Seven Fortresses Tour",
        "tour_day.9_fortresses": "Nine Fortresses Tour",
        "tour_day.nukus_museum": "Nukus Museum Tour",
        "tour_day.nukus_mizdakhan": "Nukus Museum + Mizdakhan Necropolis",
        "tour_day.muynak": "Muynak Ship Cemetery Tour",
        "tour_day.nukus_fort": "Nukus Museum via Fortresses",
        "tour_day.details_label": "Tour Details:",
        "tour_day.details_text": "Included: Driver, fuel & water. Not Included: Tickets, lunch, guide ($70-$80). You can visit a yurt camp and go for a camel ride at Ayaz-Kala.",
        "tour_day.table_price_minibus": "Minibus (1-10 pax)",
        "tour_day.features_3": "Kyzyl-Kala, Toprak-Kala, Akcha Lake, Ayaz-Kala",
        "tour_day.features_5": "Three Fortresses + Akcha Lake, Guldursun kala, Qoy qirilgan kala",
        "tour_day.features_7": "Five Fortresses + Akcha Lake, Anga kala, Janbas kala",
        "tour_day.features_9": "Seven Fortresses + Akcha Lake, Big Kirkkiz Kala + Kurgashin Kala",
        "tour_day.features_nukus": "Nukus Museam, Chilpik Kala",
        "tour_day.features_nukus_miz": "Chilpik Kala, Nukus Museam, Mizdakhan Necropolis",
        "tour_day.features_muynak": "Chilpik Kala, Nukus Museam, Aral Sea Museam, Ship Cemetry, Mizdakhan Necropolis, Nukus",
        "tour_day.features_nukus_fort": "Nukus Museam + Chilpik Kala + Three Fortresses + Akcha Lake",
        "tour_day.badai_tugai_title": "Badai Tugai + Three Fortresses",
        "tour_day.features_badai": "Badai Tugai, Kyzyl-Kala, Toprak-Kala, Akcha Lake, Ayaz-Kala",

        // PRIVATE TRANSFERS (private_transfer.html)
        "fleet.title": "Our Fleet",
        "fleet.sedan_title": "Standard Sedan",
        "fleet.sedan_capacity": "Up to 3 Pax 2 Suitcases",
        "fleet.suv_title": "Crossover (SUV)",
        "fleet.suv_capacity": "Up to 4 Pax 3 Suitcases",
        "fleet.minivan_title": "Minivan",
        "fleet.minivan_capacity": "Up to 6 Pax 6 Suitcases",
        "fleet.minibus_title": "Minibus",
        "fleet.minibus_capacity": "Up to 10-14 Pax",
        "transfers.title": "Private Transfers: Sightseeing Routes",
        "transfers.subtitle": "Turn a long drive into an enriching day trip by visiting ancient fortresses between major cities.",
        "transfers.section_title": "Connecting Tours: Khiva - Nukus / Khiva - Bukhara",
        "transfers.section_desc": "Enjoy a comfortable private transfer combined with sightseeing stops. Departure time is flexible, recommended start 8:00 AM.",
        "transfers.standard_title": "Standard Transfers (Point-to-Point)",
        "transfers.sightseeing_title": "Sightseeing Connecting Tours",
        "transfers.route": "Route",
        "transfers.stops": "Sightseeing Stops",
        "transfers.alert_label": "Alert:",
        "transfers.alert_text": "Nukus Museum is closed every Monday. Tickets, lunch, guide, and camel riding are not included in the price.",
        "transfers.route_railway": "Khiva Railway Station - Hotel",
        "transfers.route_urgench": "Khiva - Urgench Airport/Station",
        "transfers.route_shavat": "Khiva - Shavat (Turkmenistan Border)",
        "transfers.route_nukus": "Khiva - Nukus",
        "transfers.route_bukhara": "Khiva - Bukhara",
        "transfers.route_nukus": "Khiva - Nukus",
        "transfers.route_nukus_3": "Khiva - Nukus (Three Fortresses)",
        "transfers.route_nukus_4": "Khiva - Nukus (Four Fortresses)",
        "transfers.route_bukhara_3": "Khiva - Bukhara (Three Fortresses)",
        "transfers.stops_nukus": "Khiva, Chilpik Kala, Nukus",
        "transfers.stops_nukus_3": "Ayaz-Kala, Toprak-Kala, Kyzyl-Kala + Akcha Lake",
        "transfers.stops_nukus_4": "Khiva, Three Fortresses, Chilpik Kala + Akcha Lake, Nukus",
        "transfers.stops_bukhara_3": "Kyzyl-Kala, Toprak-Kala, Ayaz-Kala + Akcha Lake",
        "transfers.stops_bukhara_4": "Khiva, Three Fortresses, Big Guldursun Kala + Akcha Lake, Bukhara",
        "transfers.route_nukus_badai": "Khiva - Badai Tugai - Nukus (Three Fortresses)",
        "transfers.stops_nukus_badai": "Khiva, Ayaz-Kala, Akcha Lake, Toprak-Kala, Kyzyl-Kala, Badai Tugai Nature Reserve, Nukus",
        "transfers.route_bukhara_4": "Khiva - Bukhara (Four Fortresses)",
        "transfers.route_nukus_gaur": "Khiva - Badai Tugai - Nukus (Three Fortresses)",
        "transfers.stops_nukus_gaur": "Khiva, Gaur-Kala, Jampik Kala, Badai Tugai Nature Reserve, Chilpik Kala, Nukus",



        // COMMON & FORM
        "rooms.section_title": "Our Rooms",
        "rooms.price_from": "$50  ($35 Single Use)",
        "rooms.price_triple": "$80  ($60 Double Use),($40 Single Use)",
        "rooms.price_balcony": "$60  ($45 Single Use)",
        "rooms.per_night": "night",
        "form.details_title": "Enter Your Contact Details & Booking",
        "form.full_name": "Full Name",
        "form.email": "Email Address",
        "form.phone": "Phone Number (Optional)",
        "form.check_in": "Check-in Date *",
        "form.check_out": "Check-out Date *",
        "form.adults": "Adults",
        "form.children": "Children",
        "form.children_policy": "Children under 5 free, under 12 50% discount.",
        "form.room_selection": "Select Room Types",
        "form.quantity": "Quantity:",
        "form.notes": "Additional Notes (Optional)",
        "form.btn_book": "Finalize Booking",
        "form.alert_select_room": "Please select at least one room type and quantity.",
        "form.success": "Your booking request has been successfully sent!",
        "form.error": "Failed to send request. Please try again.",

        // MENU ITEMS
        "menu.cat_national": "National Dishes (Khorezm)",
        "menu.cat_soups": "Soups & Hearty Meals",
        "menu.cat_salads": "Salads & Starters",
        "menu.cat_drinks": "Drinks & Desserts",
        "menu.shivit": "Shivit Oshi",
        "menu.desc_shivit": "Signature Khiva green dill noodles topped with savory meat stew and yogurt.",

        // FORM PLACEHOLDERS
        "form.ph_name": "John Smith",
        "form.ph_email": "your@email.com",
        "form.ph_phone": "+998 90 123 45 67",
        "form.ph_email": "your@email.com",
        "form.ph_phone": "+998 90 123 45 67",
        "form.ph_notes": "Example: I would like a room with a better view.",

        // REVIEWS PLACEHOLDERS & OPTIONS
        "reviews.ph_name": "John Doe",
        "reviews.ph_comment": "Share your experience...",
        "reviews.opt_excellent": "⭐⭐⭐⭐⭐ (Excellent)",
        "reviews.opt_good": "⭐⭐⭐⭐ (Good)",
        "reviews.opt_average": "⭐⭐⭐ (Average)",
        "reviews.opt_poor": "⭐⭐ (Poor)",
        "reviews.opt_terrible": "⭐ (Terrible)",

        "menu.tuxum_barak": "Tuxum Barak",
        "menu.desc_tuxum_barak": "Unique square dumplings filled with spiced eggs, a local delicacy.",
        "menu.palov": "Plov (Khorezm Style)",
        "menu.desc_palov": "Khiva's version of Plov, cooked with yellow carrots and tender beef (light and flavorful).",
        "menu.manti": "Manti",
        "menu.desc_manti": "Steamed dumplings filled with hand-chopped meat and onions.",
        "menu.gumma": "Gumma",
        "menu.desc_gumma": "Fried pastries stuffed with seasoned meat, best enjoyed hot.",
        "menu.soup_barak": "Soup Barak",
        "menu.desc_soup_barak": "Miniature dumplings served in a rich, comforting broth.",
        "menu.tefteli": "Tefteli Soup",
        "menu.desc_tefteli": "Hearty vegetable soup with large meatballs.",
        "menu.special_soup": "Traditional Boiled Soup (Qaynatma)",
        "menu.desc_special_soup": "Rich and clear broth with tender meat and vegetables, cooked to perfection.",
        "menu.shashlik": "Shashlik Assortment",
        "menu.desc_shashlik": "Juicy grilled skewers: Beef, Lamb, or Chicken served with onions.",
        "menu.galubsi": "Galubsi (Stuffed Cabbage)",
        "menu.desc_galubsi": "Cabbage leaves or peppers stuffed with meat and rice.",
        "menu.somsa": "Somsa",
        "menu.desc_somsa": "Oven-baked layered pastry filled with meat or pumpkin.",
        "menu.achichuk": "Achchiq-chuchuk (tomato salad)",
        "menu.desc_achichuk": "Traditional salad of thinly sliced tomatoes and onions (spicy).",
        "menu.garden_salad": "Garden Salad",
        "menu.desc_garden_salad": "Fresh mix of cucumbers, tomatoes, and local greens.",
        "menu.caesar": "Caesar Salad",
        "menu.desc_caesar": "Classic salad with croutons, parmesan, and creamy dressing.",
        "menu.eggplant": "Eggplant Salad + boiled rice",
        "menu.desc_eggplant": "Roasted eggplants with garlic and herbs.",
        "menu.qapshirma": "Qapshirma",
        "menu.desc_qapshirma": "Fried layered dough, a delicious local side snack.",
        "menu.tea": "Tea (Green/Black)",
        "menu.desc_tea": "Served in a pot with lemon or mint.",
        "menu.juice": "Fresh Juices",
        "menu.desc_juice": "Apple, Carrot, Orange, Watermelon (seasonal).",
        "menu.wine": "Wines & Beers",
        "menu.desc_wine": "Selection of local and imported beverages.",
        "menu.cocktail": "Cocktails",
        "menu.desc_cocktail": "Mojito, Gin Tonic, and other refreshing mixes.",
        "menu.page_indicator": "Page of "
    },

































































































































































































































































































    uz: {
        "nav.home": "Bosh Sahifa",
        "nav.rooms": "Xonalar",
        "nav.tours": "Turlar",
        "nav.restaurant": "Terasli Restoran",
        "nav.gallery": "Galereya",
        "nav.admin": "Admin",

        // GALLERY PAGE
        "gallery.title": "Bizning Galereya",
        "gallery.subtitle": "Xiva qalbida muhrlangan lahzalar",
        "gallery.grid_title": "Merosni Kashf Eting",

        // GALLERY FILTERS
        "filter.all": "Barchasi",
        "filter.rooms": "Xonalar",
        "filter.dining": "Ovqatlanish",
        "filter.tours": "Turlar",
        "filter.exterior": "Hovli",

        // CONTACT / BOOKING PROMPT
        "contact.book_title": "Bron qilishga tayyormisiz?",
        "contact.book_desc": "Ushbu turni bron qilish yoki savollar berish uchun WhatsApp, Telegram yoki Email orqali biz bilan bog'laning.",

        // HOME PAGE (index.html)
        "home.hero_title": "Xiva Meros Mehmonxonasiga Xush Kelibsiz",
        "about_main.title": "Biz Haqimizda",
        "about_main.p1": "Hurmatli mehmonlar, MEROS B&B ga xush kelibsiz. MEROS B&B qadimiy Xivaning paxsadan qurilgan devorlari ichida, G'arbiy va Shimoliy darvozalar yaqinida joylashgan. Mehmon uyi 1999-yildan beri mehmonlarni qabul qilib kelmoqda. 'Meros' so'zi ingliz tilida 'cultural heritage' ma'nosini bildiradi va Matkarimovlar oilasi o'zbek madaniyati bilan chambarchas bog'langan. Ularning katta bobosi Said Arbob Xiva xonlari tomonidan yollangan usta hunarmand bo'lgan.",
        "about_main.p2": "Mulk egasi Kuranbay Matkarimovning otasi Saadulla Matkarimov (1936-1993) Sovet Ittifoqi davrida Xivani restavratsiya qilishda 20 yildan ortiq mehnat qilgan. Kuranbay Matkarimov (1957-2018) naqsh dizayni va restavratsiya ustasi bo'lgan. U Xiva, Buxoro va Shahrisabz kabi Jahon merosi markazlarida restavratsiya loyihalarida ishlagan. U Xivaning naqshinkor shiftlarini ta'mirlash bo'yicha bosh ustasi bo'lgan. MEROS mehmonxonasining xonalari va ayvonlari shiftlari aynan shu klassik Xorazm uslubida bo'yalgan.",
        "map.full_address": "<strong>Meros B&B</strong><br>A.Boltayev ko'chasi, Ichan Qala<br>Xiva, O'zbekiston",
        "footer.copyright": "© " + new Date().getFullYear() + " Meros B&B. Barcha huquqlar himoyalangan.",

        // ROOM DETAILS GENERICS
        "detail.price_prefix": "Narx:",
        "detail.book_now": "So'rov Yuborish",
        "detail.features_title": "Qulayliklar",
        "feature.bed_double": "1 ta Ikki Kishilik Yotoq",
        "feature.bed_twin": "2 ta Bir Kishilik Yotoq",
        "feature.bed_triple": "3 ta Bir Kishilik Yotoq",
        "feature.wifi": "Bepul Wi-Fi",
        "feature.bathroom": "Shaxsiy Hammom + fen",
        "feature.ac": "Konditsioner",
        "feature.fridge": "Mini Muzlatgich",
        "feature.breakfast": "Nonushta Ichida",
        "feature.balcony": "Shaxsiy Balkon",
        "detail.desc_double": "Ushbu xona o'zining qulayligi va an'anaviy dizayni bilan ajralib turadi. Xiva arxitekturasi ruhida bezatilgan bo'lib, sizga uydagidek shinamlikni taqdim etadi.",
        "detail.desc_twin": "Ikki o'rinli xona mehmonlarga ikkita qulay bir kishilik yotoq va an'anaviy muhitni taklif etadi. Do'stlar yoki hamkasblar uchun juda mos keladi.",

        // HERO SECTIONS
        "hero.title": "Xiva Qalbidagi Haqiqiy Tarixiy Muhit",
        "hero.subtitle": "Qadimiy Ichan Qala devorlari ichida tunab, tarix nafasini his qiling.",
        "hero.btn": "Xonalarni Ko'rish",
        "about.title": "Mehmonxona Haqida",
        "about.text": "MEROS B&B shaxsiy hammom va konditsionerga ega 9 ta xona, mazali o'zbek taomlari va tarixiy obidalarga oson chiqish imkoniyatini, aviachipta/poezd chiptalarini onlayn bron qilish, turlar va ekskursiyalarni tashkil etish, Aeroport/Vokzaldan transfer xizmatlari, quyosh chiqishi/botishini tomosha qilish uchun teras, bepul Wi-Fi va uy atrofida bepul avtoturargohni taklif etadi.",
        "reviews.title": "Mehmonlarimiz Fikri",
        "reviews.subtitle": "Dunyo bo'ylab sayyohlarning haqiqiy taassurotlari",
        "reviews.write_title": "Izoh Qoldirish",
        "reviews.label_name": "Ismingiz",
        "reviews.label_rating": "Baholash",
        "reviews.label_comment": "Sizning Fikringiz",
        "reviews.label_photo": "Rasm Yuklash",
        "reviews.btn_submit": "Izohni Yuborish",
        "reviews.alert_success": "Izohingiz uchun rahmat!",
        "reviews.alert_error": "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        "reviews.review1_text": "\"Xivadagi haqiqiy marvarid! Ichan Qala ichidagi joylashuvi ajoyib. Minoralarga qaragan holda qilingan tonggi nonushta sayohatimizning eng esda qolarli onlari bo'ldi. Hammaga tavsiya qilaman!\"",
        "reviews.review1_author": "Sara Jenkins",
        "reviews.review2_text": "\"Mehmonxonani boshqaradigan oila juda samimiy va mehmondo'st. Xona toza, keng va chiroyli milliy uslubda bezatilgan. Albatta yana kelamiz.\"",
        "reviews.review2_author": "Mark Dubua",
        "reviews.review3_text": "\"Narxiga arziydi. Joylashuvi juda qulay, asosiy diqqatga sazovor joylardan bir qadam narida. Xodimlar bizga qal'alarga sayohat uyushtirishda yordam berishdi, bu juda ajoyib edi.\"",
        "reviews.review3_author": "Elena K.",
        "map.title": "Bizning Manzil",
        "map.address": "Ichan Qala Devorlari Ichida",

        // FAQ SECTION
        "faq.title": "Ko'p So'raladigan Savollar (FAQ)",
        "faq.q1": "Nonushta narx ichidami?",
        "faq.a1": "Ha, mazali milliy nonushta (Shved stoli) narxga kiritilgan. Vaqt: 07:30 dan 10:00 gacha.",
        "faq.q2": "Aeroportdan kutib olish xizmati bormi?",
        "faq.a2": "Ha, biz Urganch aeroporti yoki vokzalidan shaxsiy transfer tashkil qilib beramiz (qo'shimcha to'lov evaziga).",
        "faq.q3": "Kirish va chiqish vaqtlari qanaqa?",
        "faq.a3": "Kirish (Check-in) soat 14:00 dan, Chiqish (Check-out) soat 12:00 gacha.",
        "faq.q4": "Qanday bepul xizmatlar bor?",
        "faq.a4": "Wi-Fi, Kutib olish ichimligi (Welcome drink), Seyf, Yuk tashish yordami, Poyezd va samolyot chiptalarini bron qilishga yordam.",

        // ROOMS PAGE
        "rooms.hero_title": "Bizning Xonalar",
        "rooms.hero_subtitle": "Qulaylik va an'analar uyg'unligi",
        "rooms.double_title": "Ikki Kishilik Xona (Double)",
        "rooms.double_desc": "Juftliklar uchun ajoyib tanlov. Katta ikki kishilik karavot, shaxsiy vanna xonasi va konditsioner.",
        "rooms.twin_title": "Ikki Kishilik Xona (Twin)",
        "rooms.twin_desc": "Do'stlar uchun qulay. Ikkita alohida karavot va barcha zamonaviy qulayliklar.",
        "rooms.triple_title": "Uch Kishilik Xona",
        "rooms.triple_desc": "Kichik oilalar yoki guruhlar uchun. Uchta alohida karavot va keng xona.",
        "rooms.twin_balcony_title": "Balkonli Twin Xona",
        "rooms.twin_balcony_desc": "Shaxsiy balkoningizdan shaharni tomosha qiling. Ikkita karavot va zamonaviy sharoitlar.",
        "rooms.double_balcony_title": "Balkonli Double Xona",
        "rooms.double_balcony_desc": "Shaharga qaragan shaxsiy balkonli romantik xona.",
        "rooms.view_details": "Batafsil",

        // TOURS PAGE
        "tours.hero_title": "Xiva va Atrofini Kashf Eting",
        "tours.hero_subtitle": "Siz uchun maxsus tayyorlangan sayohatlar",
        "tours.section_title": "Bizning Maxsus Sayohatlar",
        "tours.section_subtitle": "Xiva va O'zbekiston bo'ylab unutilmas sarguzashtlaringizni band qiling.",
        "tours.khiva_title": "Xiva Shahar Bo'ylab Sayohat",
        "tours.khiva_desc": "Professional gid bilan qadimiy Ichan Qalani o'rganing. Minoralar, madrasalar va muzeylarni ziyorat qiling.",
        "tours.aral_title": "Orol Dengizi Sarguzashti",
        "tours.aral_desc": "Kemalar qabristoni va Orol dengiziga 2 kunlik sayohat. O'tovda tunashni o'z ichiga oladi.",
        "tours.castles_title": "Cho'l Qal'alari (Ellik Qal'a)",
        "tours.castles_desc": "Cho'ldagi qadimiy Tuproq Qal'a, Ayaz Qal'a va Qizil Qal'alarni ziyorat qiling.",
        "tours.transfer_tour_desc": "Xorazmning qadimiy qal'alarini ziyorat qilish uchun qulay transport.",
        "tours.view_details": "Batafsil ko'rish",

        // TOUR CARDS (tours.html)
        "tours.card_day_title": "Kunlik sayohatlar",
        "tours.card_day_desc": "Maxsus bir kunlik sayohatlar Xiva atrofidagi qadimiy qal'alar va ziyoratgohlarga.",
        "tours.card_transfer_title": "Transferlar",
        "tours.card_transfer_desc": "Aeroport/temir yo'l vokzalidan mehmonxonagacha qulay va xavfsiz shaxsiy transfer xizmatlari.",
        "tours.card_aral_title": "Orol dengizi sarguzashtlari",
        "tours.card_aral_desc": "Mo'ynoq kemalar qabristoni va Orol dengizi ekoturizm maskanlariga ikki kunlik sayohat.",
        "tours.card_khiva_title": "Xiva shahri bo'ylab piyoda sayohat",
        "tours.card_khiva_desc": "Malakali gid bilan Ichan Qala ichidagi tarixiy va madaniy merosni kashf eting.",
        "tours.btn_book": "Xizmatga So'rov Yuborish",
        "tours.btn_view": "Batafsil Ko'rish",
        "tours.view_gallery": "Galereyani Ko'rish",

        // ARAL SEA TOUR DETAILS (aral_sea.html)
        "tour_aral.title": "Orol Dengizi Sarguzashtlari: Mo'ynoq Kemalar Qabristoni",
        "tour_aral.subtitle": "Kemalar qabristoni va Qoraqalpog'istonning o'ziga xos madaniyatiga guvoh bo'lish uchun jadal bir kunlik sayohat.",
        "tour_aral.section_title": "Xiva - Mo'ynoq - Xiva (1 Kunlik Tur)",
        "tour_aral.desc": "Ushbu uzoq kunlik sayohat ekologik ofat hududi va asosiy madaniy diqqatga sazovor joylarni, jumladan mashhur Nukus san'at muzeyini qamrab oladi.",
        "tour_aral.details_title": "Tur Tafsilotlari va Asosiy Qismlar:",
        "tour_aral.route_label": "Yo'nalish:",
        "tour_aral.route_text": "Chilpiq Daxma - Nukus Muzeyi - Orol Dengizi Muzeyi - Kemalar Qabristoni - Mizdaxan Nekropoli.",
        "tour_aral.start_time": "Tavsiya etilgan boshlash vaqti: 06:00 (erta boshlash zarur).",
        "tour_aral.duration": "Umumiy davomiylik: Taxminan 14-16 soat.",
        "tour_aral.driving_time": "Haydash vaqti: 9-10 soat.",
        "tour_aral.mizdakhan": "Mizdaxan Nekropoli: 9-asrga oid qadimiy dafn majmuasi.",
        "tour_aral.nukus": "Nukus Muzeyi: Sovet avangard rassomlari to'plami bilan mashhur.",
        "tour_aral.price": "Sedan Narxi (1-3 kishi): $110.",
        "tour_aral.logistics_label": "Logistika:",
        "tour_aral.logistics_text": "Haydovchi, mashina (konditsioner), yoqilg'i va suv kiritilgan. Tushlik odatda Nukusda tashkil etiladi.",

        // ARAL SEA OPTIONS (Uzbek)
        "aral.options_title": "Orol Dengizi Turi Variantlari",
        "aral.options_desc": "Biz Orol dengizi ekspeditsiyasining to'rtta o'ziga xos variantini taklif qilamiz.",
        "aral.label_route": "Yo'nalish:",
        "aral.label_duration": "Davomiyligi:",
        "aral.label_sightseeing": "Sayohat vaqti:",
        "aral.label_driving": "Haydash vaqti:",
        "aral.label_included": "Kiritilgan:",
        "aral.label_start": "Boshlanish:",
        "aral.label_not_included": "Kiritilmagan:",
        "aral.read_more": "Batafsil O'qish",
        "aral.intro_happy": "Biz ushbu turni taklif qilishdan mamnunmiz!!!",
        "aral.history_intro": "Bir paytlar dunyodagi eng katta ko'llardan biri bo'lgan Orol dengizi so'nggi o'n yilliklarda sezilarli darajada qisqardi. Markaziy Osiyoda joylashgan bo'lib, shimolda Qozog'iston va janubda O'zbekiston bilan chegaradosh. Tarixan Orol dengizi atrofidagi hududlar uchun muhim suv va baliq manbai bo'lib kelgan, ammo 1960-yillardan boshlab, Sovet davrida irrigatsiya maqsadida uni to'yintiruvchi daryolar, xususan Amudaryo va Sirdaryoning burilishi sababli quriy boshladi. Natijada Orol dengizining suv sathi keskin tushib ketdi va uning hajmi deyarli 90% ga kamaydi.",
        "aral.itinerary": "Sayohat Dasturi",
        "aral.day_1": "1-Kun",
        "aral.day_2": "2-Kun",
        "aral.notes_title": "Tashrif Buyuruvchilar Uchun Eslatmalar",
        "aral.booking_desc": "Ushbu variantlardan birini band qilish uchun biz bilan bevosita bog'laning. \"1, 2, 3 yoki 4-variant\" deb ayting.",

        "aral.note_drivers": "Haydovchilar suratga olishingiz uchun diqqatga sazovor joylarda to'xtashadi.",
        "aral.note_mobile": "Mobil qurilmalar, kameralar va videokameralarni o'tov lagerida quvvatlash mumkin.",
        "aral.note_cold": "Ertalab va kechqurun dengiz bo'yi sovuq bo'ladi. Issiq kiyim yoki kurtka oling.",
        "aral.note_illness": "Agar surunkali kasalliklaringiz bo'lsa, dori-darmonlaringizni unutmang.",
        "aral.note_water": "Har doim yoningizda suv olib yuring.",
        "aral.note_guide": "Gidingiz va transportingizga yaqin turing.",
        "aral.note_cliff": "Ustyurt platosi chetidan kamida 2 metr uzoqlikda turing.",
        "aral.note_excluded_val": "Kirish chiptalari, tushlik, gid ($150) va h.k.",

        // Prices for Aral Sea Options
        "price.1pax_500": "1 Kishi: $500",
        "price.2pax_540": "2 Kishi: $540",
        "price.3pax_580": "3 Kishi: $580",
        "price.4pax_620": "4 Kishi: $620",
        "price.1pax_550": "1 Kishi: $550",
        "price.2pax_590": "2 Kishi: $590",
        "price.3pax_630": "3 Kishi: $630",
        "price.4pax_670": "4 Kishi: $670",
        "price.1pax_470": "1 Kishi: $470",
        "price.2pax_510": "2 Kishi: $510",
        "price.3pax_550": "3 Kishi: $550",
        "price.4pax_590": "4 Kishi: $590",

        // Option 4 Prices (New)
        "price.opt4_1pax": "1 Kishi: $490",
        "price.opt4_2pax": "2 Kishi: $530",
        "price.opt4_3pax": "3 Kishi: $570",
        "price.opt4_4pax": "4 Kishi: $610",

        // Option 1
        "aral.opt1_title": "1-Variant: Orol Dengizi Sarguzashti (Klassik)",
        "aral.opt1_route_text": "Xiva - Chilpiq Qal'a - Nukus Muzeyi - Mo'ynoq Tarix Muzeyi - Mo'ynoq Kemalar Qabristoni - Buyuk Ustyurt Kanyonlari - Ko'chmanchilar Qabrlari - Orol Dengizi qirg'og'ida tunash - Kurgancha Qal'a - Mizdaxan Nekropoli - Nukus - Xiva",
        "aral.opt1_dur_val": "2 kun va 1 tun",
        "aral.opt1_sight_val": "6-8 soat",
        "aral.opt1_drive_val": "16-18 soat",
        "aral.opt1_inc_val": "Transport (4WD va Haydovchili Sedan), O'tov Lagerida Tunash, Kechki Ovqat va Nonushta.",
        "aral.opt1_start_val": "06:00 (Tavsiya etiladi)",
        "aral.opt1_d1_1": "Ertalab soat 06:00 da boshlash tavsiya etiladi. Xivadan sedan mashinasida boshlanadi va tugaydi.",
        "aral.opt1_d1_2": "Chilpiq Qal'aga tashrif.",
        "aral.opt1_d1_3": "Nukus San'at Muzeyi.",
        "aral.opt1_d1_4": "Mo'ynoqqa kelish, mahalliy kafeda tushlik.",
        "aral.opt1_d1_5": "Mo'ynoq davlat o'lkashunoslik muzeyi va bir vaqtlar gullab-yashnagan Mo'ynoq tarixi haqida video tomosha qilish.",
        "aral.opt1_d1_6": "Kemalar Qabristoniga tashrif.",
        "aral.opt1_d1_7": "Orol dengizi sayohati 4WD (Jip) da boshlanadi.",
        "aral.opt1_d1_8": "Ustyurt platosining ajoyib kanyonlari, kosmik manzara, ko'chmanchilar qabrlariga tashrif.",
        "aral.opt1_d1_9": "Orol dengiziga soat 18:30 atrofida yetib kelish. Dengiz qirg'og'ida sayr qilish, mehmonlar dengizda cho'milishlari mumkin.",
        "aral.opt1_d1_10": "Orol dengizi qirg'og'idagi o'tov lageriga yetib kelish. Lagerda toza chuchuk suvli dush va hojatxona mavjud.",
        "aral.opt1_d1_11": "Soat 19:30 da oshxonada kechki ovqat va ertasi kuni 07:00 da nonushta.",
        "aral.opt1_d2_1": "Orol dengizi ustida quyosh chiqishini o'tkazib yubormang.",
        "aral.opt1_d2_2": "07:00 Nonushta.",
        "aral.opt1_d2_3": "08:00 Qaytish uchun yo'lga chiqish.",
        "aral.opt1_d2_4": "Buyuk Ipak Yo'lidagi mustahkam savdo posti bo'lgan Kurgancha-qal'aga (XII-XVI asrlar) tashrif.",
        "aral.opt1_d2_5": "Mo'ynoqqa yetib kelish va 4WD mashinasini sedanga almashtirish va yo'lda mahalliy kafeda tushlik qilish.",
        "aral.opt1_d2_6": "Mizdaxan Nekropoli (XIV asr) me'moriy majmuasiga tashrif.",
        "aral.opt1_d2_7": "Va Xivaga qaytish (agar xohlasangiz Nukus, Urganch, aeroport), tamom.",

        // Option 2
        "aral.opt2_title": "2-Variant: Orol Dengizi va Sudochie (Kengaytirilgan)",
        "aral.opt2_route_text": "Xiva - Chilpiq Qal'a - Nukus Muzeyi - Mo'ynoq Tarix Muzeyi - Mo'ynoq Kemalar Qabristoni - Buyuk Ustyurt Kanyonlari - Ko'chmanchilar Qabrlari - Orol Dengizi qirg'og'ida tunash - Kurgancha Qal'a - Kubla Ustyurt, Sudochie Ko'li Urga - Mizdaxan Nekropoli - Nukus - Xiva",
        "aral.opt2_dur_val": "2 kun va 1 tun",
        "aral.opt2_sight_val": "6-8 soat",
        "aral.opt2_drive_val": "16-18 soat",
        "aral.opt2_inc_val": "Transport (4WD va Haydovchili Sedan), O'tov Lagerida Tunash, Kechki Ovqat va Nonushta.",
        "aral.opt2_start_val": "06:00 (Tavsiya etiladi)",
        "aral.opt2_d1_1": "Ertalab soat 06:00 da boshlash tavsiya etiladi. Xivadan sedan mashinasida boshlanadi va tugaydi.",
        "aral.opt2_d1_2": "Chilpiq Qal'aga tashrif.",
        "aral.opt2_d1_3": "Nukus San'at Muzeyi.",
        "aral.opt2_d1_4": "Nukusdan 4WD da boshlanadi va tugaydi.",
        "aral.opt2_d1_5": "Mo'ynoqqa kelish, mahalliy kafeda tushlik.",
        "aral.opt2_d1_6": "Mo'ynoq davlat o'lkashunoslik muzeyi va bir vaqtlar gullab-yashnagan Mo'ynoq tarixi haqida video tomosha qilish.",
        "aral.opt2_d1_7": "Kemalar Qabristoniga tashrif.",
        "aral.opt2_d1_8": "Ustyurt platosining ajoyib kanyonlari, kosmik manzara, ko'chmanchilar qabrlariga tashrif.",
        "aral.opt2_d1_9": "Orol dengiziga soat 18:30 atrofida yetib kelish. Dengiz qirg'og'ida sayr qilish, mehmonlar dengizda cho'milishlari mumkin.",
        "aral.opt2_d1_10": "Orol dengizi qirg'og'idagi o'tov lageriga yetib kelish. Lagerda toza chuchuk suvli dush va hojatxona mavjud.",
        "aral.opt2_d1_11": "Soat 19:30 da oshxonada kechki ovqat va ertasi kuni 07:00 da nonushta.",
        "aral.opt2_d2_1": "Orol dengizi ustida quyosh chiqishini o'tkazib yubormang.",
        "aral.opt2_d2_2": "07:00 Nonushta.",
        "aral.opt2_d2_3": "08:00 Qaytish uchun yo'lga chiqish.",
        "aral.opt2_d2_4": "Kurgancha-qal'aga (XII-XVI asrlar) tashrif.",
        "aral.opt2_d2_5": "Kubla-Ustyurt qishlog'iga (tashlandiq Sovet shaharchasi) tashrif.",
        "aral.opt2_d2_6": "Sudochie ko'lidagi Urga (tashlandiq baliqchilar qishlog'i).",
        "aral.opt2_d2_7": "\"Sudochie\" Davlat Ornitologiya Qo'riqxonasi (Qushlarni kuzatish, flamingolar va h.k.).",
        "aral.opt2_d2_8": "Mizdaxan Nekropoli me'moriy majmuasiga tashrif.",
        "aral.opt2_d2_9": "Nukusga yetib kelish va 4WD mashinasini sedanga almashtirish va Xivaga qaytish (yoki Nukus/Urganch aeroporti), tamom.",

        // Option 3
        "aral.opt3_title": "3-Variant: Orol Dengizi Sarguzashti (Qo'ng'irot orqali)",
        "aral.opt3_route_text": "Xiva - Chilpiq Qal'a - Nukus Muzeyi - Mo'ynoq Tarix Muzeyi - Mo'ynoq Kemalar Qabristoni - Buyuk Ustyurt Kanyonlari - Ko'chmanchilar Qabrlari - Orol Dengizi qirg'og'ida tunash - Kurgancha Qal'a - Kubla Ustyurt, Sudochie Ko'li, Urga - Mizdaxan Nekropoli - Nukus - Xiva",
        "aral.opt3_dur_val": "2 kun va 1 tun",
        "aral.opt3_sight_val": "6-8 soat",
        "aral.opt3_drive_val": "16-18 soat",
        "aral.opt3_inc_val": "Transport (4WD va Haydovchili Sedan), O'tov Lagerida Tunash, Kechki Ovqat va Nonushta.",
        "aral.opt3_d1_1": "Ertalab soat 06:00 da boshlash tavsiya etiladi. Xivadan sedan mashinasida boshlanadi va tugaydi.",
        "aral.opt3_d1_2": "Chilpiq Qal'aga tashrif.",
        "aral.opt3_d1_3": "Nukus San'at Muzeyi.",
        "aral.opt3_d1_4": "Mo'ynoqqa kelish, mahalliy kafeda tushlik.",
        "aral.opt3_d1_5": "Mo'ynoqdan 4WD da boshlanadi.",
        "aral.opt3_d1_6": "Mo'ynoq davlat o'lkashunoslik muzeyi va bir vaqtlar gullab-yashnagan Mo'ynoq tarixi haqida video tomosha qilish.",
        "aral.opt3_d1_7": "Kemalar Qabristoniga tashrif.",
        "aral.opt3_d1_8": "Ustyurt platosining ajoyib kanyonlari, kosmik manzara, ko'chmanchilar qabrlariga tashrif.",
        "aral.opt3_d1_9": "Orol dengiziga soat 18:30 atrofida yetib kelish. Dengiz qirg'og'ida sayr qilish, mehmonlar dengizda cho'milishlari mumkin.",
        "aral.opt3_d1_10": "Orol dengizi qirg'og'idagi o'tov lageriga yetib kelish. Lagerda toza chuchuk suvli dush va hojatxona mavjud.",
        "aral.opt3_d1_11": "Soat 19:30 da oshxonada kechki ovqat va ertasi kuni 07:00 atrofida nonushta.",
        "aral.opt3_d2_1": "Orol dengizi ustida quyosh chiqishini o'tkazib yubormang.",
        "aral.opt3_d2_2": "07:00 Nonushta.",
        "aral.opt3_d2_3": "08:00 Qaytish uchun yo'lga chiqish.",
        "aral.opt3_d2_4": "Kurgancha-qal'aga (XII-XVI asrlar) tashrif.",
        "aral.opt3_d2_5": "Kubla-Ustyurt qishlog'iga tashrif.",
        "aral.opt3_d2_6": "Urga (baliqchilar qishlog'i qoldiqlari).",
        "aral.opt3_d2_7": "\"Sudochie\" Davlat Ornitologiya Qo'riqxonasi.",
        "aral.opt3_d2_8": "Mizdaxan Nekropoli me'moriy majmuasiga tashrif.",
        "aral.opt3_d2_9": "Qo'ng'irotga yetib kelish va 4WD mashinasini sedanga almashtirish va Xivaga qaytish (yoki Nukus/Urganch aeroporti), tamom.",

        // Option 4
        "aral.opt4_title": "4-Variant: Nukusdan Orol Dengiziga (Faqat 4WD)",
        "aral.opt4_route_text": "Nukus - Mizdaxan Nekropoli - Mo'ynoq Tarix Muzeyi - Mo'ynoq Kemalar Qabristoni - Buyuk Ustyurt Kanyonlari - Ko'chmanchilar Qabrlari - Orol Dengizi qirg'og'ida tunash - Kurgancha Qal'a - Kubla Ustyurt - Sudochie Ko'li - Urga - Nukus",
        "aral.opt4_dur_val": "2 kun va 1 tun",
        "aral.opt4_sight_val": "6-8 soat",
        "aral.opt4_drive_val": "12-14 soat",
        "aral.opt4_inc_val": "Transport (4WD va Haydovchi), O'tov Lagerida Tunash, Kechki Ovqat va Nonushta.",
        "aral.opt4_start_val": "06:00 (Tavsiya etiladi)",
        "aral.opt4_d1_1": "Nukusdan 4WD da boshlanadi.",
        "aral.opt4_d1_2": "Mizdaxan Nekropoli me'moriy majmuasiga tashrif.",
        "aral.opt4_d1_3": "Mo'ynoqqa kelish, mahalliy kafeda tushlik.",
        "aral.opt4_d1_4": "Mo'ynoq davlat o'lkashunoslik muzeyi va bir vaqtlar gullab-yashnagan Mo'ynoq tarixi haqida video tomosha qilish.",
        "aral.opt4_d1_5": "Kemalar Qabristoniga tashrif.",
        "aral.opt4_d1_6": "Ustyurt platosining ajoyib kanyonlari, kosmik manzara, ko'chmanchilar qabrlariga tashrif.",
        "aral.opt4_d1_7": "Orol dengiziga kelish, dengiz qirg'og'ida sayr qilish, mehmonlar dengizda cho'milishlari mumkin.",
        "aral.opt4_d1_8": "Orol dengizi qirg'og'idagi o'tov lageriga yetib kelish. Lagerda toza chuchuk suvli dush va hojatxona mavjud.",
        "aral.opt4_d1_9": "19:30 kechki ovqat va ertasi kuni 07:00 da nonushta.",
        "aral.opt4_d2_1": "Orol dengizi ustida quyosh chiqishini o'tkazib yubormang.",
        "aral.opt4_d2_2": "07:00 Nonushta.",
        "aral.opt4_d2_3": "08:00 Qaytish uchun yo'lga chiqish.",
        "aral.opt4_d2_4": "Kurgancha-qal'aga (XII-XVI asrlar) tashrif.",
        "aral.opt4_d2_5": "Kubla-Ustyurt qishlog'iga tashrif.",
        "aral.opt4_d2_6": "Urga (baliqchilar qishlog'i qoldiqlari).",
        "aral.opt4_d2_7": "\"Sudochie\" Davlat Ornitologiya Qo'riqxonasi.",
        "aral.opt4_d2_8": "Nukusga yetib kelish, tamom.",


        // KHIVA TOUR DETAILS
        "tour_khiva.title": "Xiva Shahri Bo'ylab Piyoda Sayohat",
        "tour_khiva.subtitle": "YuNESKO Jahon merosi ro'yxatiga kiritilgan Ichan-Qal'aning sirlarini kashf eting.",
        "tour_khiva.section_title": "Boqiy Ichan-Qal'ani O'rganing",
        "tour_khiva.desc": "Xiva tarixiy markazi bo'ylab sayr qilib, uning ajoyib minoralari, masjidlari va madrasalarini tomosha qiling. Qadimiy Markaziy Osiyo markazining tarixi va madaniyatiga sho'ng'ing.",
        "tour_khiva.highlights_title": "Piyoda Sayohatning Asosiy Qismlari:",
        "tour_khiva.highlight_1": "Kalta Minor minorasi va Muhammad Aminxon madrasasi.",
        "tour_khiva.highlight_2": "O'ziga xos yog'och ustunlari bilan Juma masjidi.",
        "tour_khiva.highlight_3": "Ko'hna Ark (Eski Qal'a) va Tosh-Hovli saroyi.",
        "tour_khiva.booking_note": "Band qilish:",
        "tour_khiva.booking_info": "Ushbu tur uchun malakali mahalliy gid xizmati so'rov bo'yicha mavjud. Gid xizmati alohida to'lanadi (Gid xizmati narxi taxminan $70-$80).",

        // KHIVA TOUR PROGRAM (Uzbek)
        "khiva.program_title": "DASTUR",
        "khiva.morning_title": "TONG: Xonlar Afsonalari (09:00 - 13:00)",
        "khiva.morning_1": "09:00: Gid bilan mehmonxonada uchrashuv. Turni G'arbiy Darvozadan (Ota Darvoza) boshlash.",
        "khiva.morning_2": "Kalta Minor Minorasi: Mashhur tugallanmagan ko'k minora.",
        "khiva.morning_3": "Muhammad Aminxon Madrasasi: O'rta Osiyodagi eng katta o'rta asr madrasasi.",
        "khiva.morning_4": "Ko'hna Ark: Qal'a ichidagi qadimiy qal'a.",
        "khiva.lunch_desc": "An'anaviy choyxonada Shivit Oshi tatib ko'rish uchun tushlik.",
        "khiva.afternoon_1": "Juma Masjidi: 213 ta noyob yog'och ustunli durdona obida.",
        "khiva.afternoon_2": "Pahlavon Mahmud Maqbarasi: Xivadagi eng tabarruk joy.",
        "khiva.afternoon_3": "Islom Xo'ja Minorasi: Xivadagi eng baland minora.",
        "khiva.price_title": "Tur Narxi",
        "khiva.price_desc": "Bu shaxsiy gidli tur. Narx kishi boshiga emas, guruh uchun.",
        "khiva.price_val": "$70 (Gid Xizmati)",


        // FORTRESS DAY TRIPS (private_day.html)
        "tour_day.title": "Xorazmning Qadimiy Qal'alari Turi",
        "tour_day.subtitle": "Minglab qadimiy qal'alar va saroylar qoldiqlari bilan mashhur bo'lgan Ellik Qal'a mintaqasini o'rganing.",
        "tour_day.section_title": "Xiva Qal'alariga Kunlik Sayohatlar",
        "tour_day.desc": "Vaqtingiz va tarixiy qiziqishingizga mos eng yaxshi variantni tanlang. Barcha turlar Xivadagi mehmonxonangizdan boshlanadi va tugaydi. Boshlanish vaqti moslashuvchan (09:00 dan 16:00 gacha).",
        "tour_day.table_name": "Tur Nomi",
        "tour_day.table_fortresses": "Asosiy Qal'alar",
        "tour_day.table_duration": "Davomiyligi",
        "tour_day.table_price_sedan": "Sedan Narxi (1-3 kishi)",
        "tour_day.table_price_suv": "SUV Narxi (1-4 kishi)",
        "tour_day.table_price_minivan": "Minivan Narxi (4-6 kishi)",
        "tour_day.3_fortresses": "Uch Qal'a Turi",
        "tour_day.5_fortresses": "Besh Qal'a Turi",
        "tour_day.7_fortresses": "Yetti Qal'a Turi",
        "tour_day.9_fortresses": "To'qqiz Qal'a Turi",
        "tour_day.nukus_museum": "Nukus Muzeyi Turi",
        "tour_day.nukus_mizdakhan": "Nukus Muzeyi va Mizdaxan Nekropoli",
        "tour_day.muynak": "Mo'ynoq Kemalar Qabristoni Turi",
        "tour_day.nukus_fort": "Nukus Muzeyi (Qal'alar orqali)",
        "tour_day.approx_hours": "Taxminan %s soat",
        "tour_day.details_label": "Tur Tafsilotlari:",
        "tour_day.details_text": "Kiritilgan: Haydovchi, yoqilg'i va suv. Kiritilmagan: Chiptalar, tushlik, gid ($70-$80). Ayaz-Qal'ada o'tov lageriga tashrif buyurishingiz va tuyada sayr qilishingiz mumkin.",
        "tour_day.table_price_minibus": "Mikroavtobus (1-10 kishi)",
        "tour_day.features_3": "Qizil Qal'a, Tuproq Qal'a, Akcha Ko'li, Ayaz Qal'a",
        "tour_day.features_5": "Uch Qal'a + Akcha Ko'li, Guldursun Qal'a, Qo'yqirilgan Qal'a",
        "tour_day.features_7": "Besh Qal'a + Akcha Ko'li, Anga Qal'a, Jonbos Qal'a",
        "tour_day.features_9": "Yetti Qal'a + Akcha Ko'li, Katta Qirqqiz Qal'a + Qo'rg'oshin Qal'a",
        "tour_day.features_nukus": "Nukus Muzeyi, Chilpiq Qal'a",
        "tour_day.features_nukus_miz": "Chilpiq Qal'a, Nukus Muzeyi, Mizdaxan Nekropoli",
        "tour_day.features_muynak": "Chilpiq Qal'a, Nukus Muzeyi, Orol Dengizi Muzeyi, Kemalar Qabristoni, Mizdaxan Nekropoli, Nukus",
        "tour_day.features_nukus_fort": "Nukus Muzeyi + Chilpiq Qal'a + Uch Qal'a + Akcha Ko'li",
        "tour_day.badai_tugai_title": "Baday To'qay + Uch Qal'a",
        "tour_day.features_badai": "Baday To'qay, Qizil Qal'a, Tuproq Qal'a, Oqcha Ko'li, Ayaz Qal'a",

        // PRIVATE TRANSFERS (private_transfer.html)
        "fleet.title": "Bizning Avtopark",
        "fleet.sedan_title": "Standart Sedan",
        "fleet.sedan_capacity": "3 Kishigacha 2 Chemodan",
        "fleet.suv_title": "Krossover (SUV)",
        "fleet.suv_capacity": "4 Kishigacha 3 Chemodan",
        "fleet.minivan_title": "Minivan",
        "fleet.minivan_capacity": "6 Kishigacha 6 Chemodan",
        "fleet.minibus_title": "Mikroavtobus",
        "fleet.minibus_capacity": "10-14 Kishigacha",
        "transfers.title": "Shaxsiy Transferlar: Sayohat Yo'nalishlari",
        "transfers.subtitle": "Uzoq yo'lni qiziqarli sayohatga aylantiring va shaharlar o'rtasidagi qadimiy qal'alarni ziyorat qiling.",
        "transfers.section_title": "Bog'lovchi Turlar: Xiva - Nukus / Xiva - Buxoro",
        "transfers.section_desc": "Qulay shaxsiy transfer va diqqatga sazovor joylarga to'xtashlardan bahramand bo'ling. Ketish vaqti moslashuvchan, lekin tavsiya etilgan vaqt 8:00.",
        "transfers.standard_title": "Standart Transferlar (Nuqtadan-Nuqtaga)",
        "transfers.sightseeing_title": "Sayohat Bog'lovchi Turlar",
        "transfers.route": "Yo'nalish",
        "transfers.stops": "To'xtash Joylari",
        "transfers.alert_label": "Diqqat:",
        "transfers.alert_text": "Nukus muzeyi har dushanba yopiq. Chiptalar, tushlik, gid va tuya minish narxga kiritilmagan.",
        "transfers.route_railway": "Xiva Temir Yo'l Vokzali - Mehmonxona",
        "transfers.route_urgench": "Xiva - Urganch Aeroporti/Temir Yo'l Vokzali",
        "transfers.route_shavat": "Xiva - Shovot (Turkmaniston Chegarasi)",
        "transfers.route_nukus": "Xiva - Nukus",
        "transfers.route_bukhara": "Xiva - Buxoro",

        "transfers.route_nukus_3": "Xiva - Nukus (Uch Qal'a)",
        "transfers.route_nukus_4": "Xiva - Nukus (To'rt Qal'a)",
        "transfers.route_bukhara_3": "Xiva - Buxoro (Uch Qal'a)",
        "transfers.stops_nukus": "Xiva, Chilpiq Qal'a, Nukus",
        "transfers.stops_nukus_3": "Ayaz Qal'a, Tuproq Qal'a, Qizil Qal'a + Oqcha Ko'li",
        "transfers.stops_nukus_4": "Xiva, Uch Qal'a, Chilpiq Qal'a + Oqcha Ko'li, Nukus",
        "transfers.stops_bukhara_3": "Qizil Qal'a, Tuproq Qal'a, Ayaz Qal'a + Oqcha Ko'li",
        "transfers.route_nukus_badai": "Xiva - Baday To'qay - Nukus (Uch Qal'a)",
        "transfers.stops_nukus_badai": "Xiva, Ayaz Qal'a, Oqcha Ko'li, Tuproq Qal'a, Qizil Qal'a, Baday To'qay Qo'riqxonasi, Nukus",
        "transfers.route_bukhara_4": "Xiva - Buxoro (To'rt Qal'a)",
        "transfers.stops_bukhara_4": "Xiva, Uch Qal'a, Katta Guldursun Qal'a + Oqcha Ko'li, Buxoro",
        "transfers.route_nukus_gaur": "Xiva - Baday To'qay - Nukus (Uch Qal'a)",
        "transfers.stops_nukus_gaur": "Xiva, G'ovur Qal'a, Jampiq Qal'a, Baday To'qay Qo'riqxonasi, Chilpiq Qal'a, Nukus",



        // COMMON & FORM
        "rooms.section_title": "Bizning Xonalar",
        "rooms.price_from": "$50  ($35 Bir Kishilik)",
        "rooms.price_triple": "$80  ($60 Ikki Kishilik),($40 Bir Kishilik)",
        "rooms.price_balcony": "$60  ($45 Bir Kishilik)",
        "rooms.per_night": "tun",
        "form.details_title": "Bog'lanish Ma'lumotlari va Band Qilish",
        "form.full_name": "To'liq Ismingiz",
        "form.email": "Email Manzil",
        "form.phone": "Telefon Raqam (Ixtiyoriy)",
        "form.check_in": "Kirish Sanasi *",
        "form.check_out": "Chiqish Sanasi *",
        "form.adults": "Kattalar",
        "form.children": "Bolalar",
        "form.children_policy": "5 yoshgacha bolalar bepul (bor joylarda), 12 yoshgacha 50% chegirma.",
        "form.room_selection": "Xona Turini Tanlang",
        "form.quantity": "Soni:",
        "form.notes": "Qo'shimcha Izohlar (Ixtiyoriy)",
        "form.btn_book": "So'rovni Yuborish",
        "form.alert_select_room": "Iltimos, band qilish uchun kamida bitta xona turi va sonini tanlang.",
        "form.success": "Buyurtmangiz muvaffaqiyatli yuborildi!",
        "form.error": "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",

        // FORM PLACEHOLDERS
        "form.ph_name": "Vali Valiyev",
        "form.ph_email": "sizning@email.uz",
        "form.ph_phone": "+998 90 123 45 67",
        "form.ph_notes": "Masalan: Menga manzarali xona kerak.",

        // REVIEWS PLACEHOLDERS & OPTIONS
        "reviews.ph_name": "Ali Valiyev",
        "reviews.ph_comment": "Taassurotlaringiz bilan bo'lishing...",
        "reviews.opt_excellent": "⭐⭐⭐⭐⭐ (A'lo)",
        "reviews.opt_good": "⭐⭐⭐⭐ (Yaxshi)",
        "reviews.opt_average": "⭐⭐⭐ (O'rtacha)",
        "reviews.opt_poor": "⭐⭐ (Yomon)",
        "reviews.opt_terrible": "⭐ (Juda Yomon)",

        // Option 2 Prices (New)
        "price.opt2_1pax": "1 Pax: $580",
        "price.opt2_2pax": "2 Pax: $620",
        "price.opt2_3pax": "3 Pax: $660",
        "price.opt2_4pax": "4 Pax: $700",
        // DINING PAGE (Uzbek Translations)
        "dining.hero_title": "Terasda Ovqatlanish",
        "dining.hero_subtitle": "Qadimiy shahar manzarasidan bahramand bo'lib, an'anaviy O'zbek taomlarini tatib ko'ring.",
        "dining.view_menu": "Menyuni Ko'rish",
        "menu.cat_national": "Milliy Taomlar (Xorazm)",
        "menu.cat_soups": "Sho'rvalar va Quyouq Taomlar",
        "menu.cat_salads": "Salatlar va Gazaklar",
        "menu.cat_drinks": "Ichimliklar va Shirinliklar",

        "menu.shivit": "Shivit Oshi",
        "menu.desc_shivit": "Xivaning mashhur shivitli lag'moni, sabzavotli qayla va qatiq bilan.",
        "menu.tuxum_barak": "Tuxum Barak",
        "menu.desc_tuxum_barak": "Tuxum bilan to'ldirilgan o'ziga xos to'rtburchak chuchvara, mahalliy delikates.",
        "menu.palov": "Xorazmcha Palov",
        "menu.desc_palov": "Sariq sabzi va yumshoq mol go'shti bilan tayyorlangan an'anaviy palov (yog'siz va mazali).",
        "menu.manti": "Manti",
        "menu.desc_manti": "Qo'lda to'g'ralgan go'sht va piyoz bilan to'ldirilgan bug'da pishgan taom.",
        "menu.gumma": "Gumma",
        "menu.desc_gumma": "Ziravorli go'sht bilan to'ldirilgan qovurilgan pishiriq, issiq holda iste'mol qilinadi.",

        "menu.soup_barak": "Suyuq Osh (Barak)",
        "menu.desc_soup_barak": "Boy va mazali bulyonda pishirilgan kichik chuchvaralar.",
        "menu.tefteli": "Teftel Sho'rva",
        "menu.desc_tefteli": "Yumshoq go'shtli koptokchalar bilan tayyorlangan to'yimli sabzavotli sho'rva.",
        "menu.special_soup": "Qaynatma Sho'rva",
        "menu.desc_special_soup": "Yumshoq go'sht va sabzavotlar bilan uzoq qaynatilgan mazali va to'yimli sho'rva.",
        "menu.shashlik": "Shashlik Assorti",
        "menu.desc_shashlik": "Sersuv kaboblar: Mol, Qo'y yoki Tovuq go'shti, piyoz bilan tortiladi.",
        "menu.galubsi": "Karam Do'lma (Golubsi)",
        "menu.desc_galubsi": "Go'sht va guruch bilan to'ldirilgan karam yoki bulg'or qalampiri.",

        "menu.achichuk": "Achchiq-Chuchuk",
        "menu.desc_achichuk": "Yupqa to'g'ralgan pomidor va piyoz salati (qalampirli).",
        "menu.garden_salad": "Mevsumiy Bog' Salati",
        "menu.desc_garden_salad": "Bodring, pomidor va mahalliy ko'katlardan tayyorlangan yangi salat.",
        "menu.caesar": "Sezar Salati",
        "menu.desc_caesar": "Krutonlar, parmezan va qaymoqli sous bilan klassik salat.",
        "menu.eggplant": "Baqlajonli Salat + qaynatilgan guruch",
        "menu.desc_eggplant": "Sarimsoq va ko'katlar bilan qovurilgan baqlajon.",
        "menu.qapshirma": "Qapshirma",
        "menu.desc_qapshirma": "Qovurilgan qatlama xamir, mahalliy sevimli gazak.",

        "menu.tea": "Choylar (Ko'k/Qora)",
        "menu.desc_tea": "Limon yoki yalpiz bilan choynakda tortiladi.",
        "menu.juice": "Yangi Siqilgan Sharbatlar",
        "menu.desc_juice": "Olma, Sabzi, Apelsin, Tarvuz (mavsumiy).",
        "menu.wine": "Mahalliy Sharob va Pivo",
        "menu.desc_wine": "Mahalliy va import ichimliklar tanlovi.",
        "menu.cocktail": "Kokteyllar",
        "menu.desc_cocktail": "Moxito, Jin Tonik va boshqa tetiklantiruvchi ichimliklar.",
    },
    ru: {
        "nav.home": "Главная",
        "nav.rooms": "Номера",
        "nav.tours": "Туры",
        "nav.restaurant": "Ресторан на Террасе",
        "nav.gallery": "Галерея",
        "nav.admin": "Админ",

        // DINING PAGE
        "dining.hero_title": "Ужин на Крыше",
        "dining.hero_subtitle": "Насладитесь традиционной узбекской кухней с панорамным видом на Старый город.",
        "dining.view_menu": "Посмотреть Меню",
        "menu.title": "Наше Меню",

        // GALLERY PAGE
        "gallery.title": "Наша Галерея",
        "gallery.subtitle": "Моменты, запечатленные в сердце Хивы",
        "gallery.grid_title": "Исследуйте Meros",

        // GALLERY FILTERS
        "filter.all": "Все",
        "filter.rooms": "Номера",
        "filter.dining": "Ресторан",
        "filter.tours": "Туры",
        "filter.exterior": "Двор",

        // CONTACT / BOOKING PROMPT
        "contact.book_title": "Готовы забронировать?",
        "contact.book_desc": "Чтобы забронировать этот тур или задать вопросы, свяжитесь с нами напрямую через WhatsApp, Telegram или Email.",

        // HOME PAGE (index.html)
        "home.hero_title": "Добро пожаловать в отель Хива Мерос",
        "about_main.title": "О Нас",
        "about_main.p1": "Уважаемые гости, добро пожаловать в MEROS B&B. MEROS B&B расположен внутри глинобитных стен древней Хивы, недалеко от западных и северных ворот. Гостевой дом начал принимать гостей в 1999 году. 'Meros' означает 'культурное наследие', и семья Маткаримовых глубоко погружена в узбекскую культуру. Их прадед Саид Арбоб был мастером-ремесленником (усто), нанятым хивинскими ханами.",
        "about_main.p2": "Саадулла Маткаримов (1936-1993), отец владельца Куранбая Маткаримова, более 20 лет работал над реставрацией Хивы в советское время. Куранбай Маткаримов (1957-2018) был мастером орнамента и реставрации. Он работал над проектами реставрации в центрах Всемирного наследия Хивы, Бухары и Шахрисабза. Он был главным реставратором расписных потолков Хивы. Потолки в гостевых комнатах и на верандах MEROS расписаны именно в этом классическом хорезмском стиле.",
        "map.full_address": "<strong>Meros B&B</strong><br>Улица А.Болтаева, Ичан-Кала<br>Хива, Узбекистан",
        "footer.copyright": "© " + new Date().getFullYear() + " Meros B&B. Все права защищены.",

        // ROOM DETAILS GENERICS
        "detail.price_prefix": "Цена:",
        "detail.book_now": "Отправить Запрос",
        "detail.features_title": "Удобства",
        "feature.bed_double": "1 Двуспальная Кровать",
        "feature.bed_twin": "2 Односпальные Кровати",
        "feature.bed_triple": "3 Односпальные Кровати",
        "feature.wifi": "Бесплатный Wi-Fi",
        "feature.bathroom": "Собственная Ванная + фен",
        "feature.ac": "Кондиционер",
        "feature.fridge": "Мини-холодильник",
        "feature.breakfast": "Завтрак Включен",
        "feature.balcony": "Собственный балкон",
        "detail.desc_double": "Этот номер отличается комфортом и традиционным дизайном. Оформленный в духе хивинской архитектуры, он предлагает вам домашний уют.",
        "detail.desc_twin": "Номер Твин предлагает гостям две удобные односпальные кровати и традиционную обстановку. Идеально подходит для друзей или коллег, путешествующих вместе.",

        // HERO SECTIONS
        "hero.title": "Аутентичный Опыт в Сердце Хивы",
        "hero.subtitle": "Остановитесь в древних стенах Ичан-Калы и почувствуйте дух истории.",
        "hero.btn": "Смотреть Номера",
        "about.title": "О Отеле",
        "about.text": "MEROS B&B предлагает 9 номеров с кондиционером и собственной ванной комнатой, вкусную узбекскую кухню и легкий доступ к историческим достопримечательностям, онлайн-бронирование авиа/жд билетов, организацию туров и экскурсий, трансферы от/до аэропорта/вокзала, террасу на крыше для встречи заката/рассвета, бесплатный Wi-Fi и бесплатную парковку вокруг дома.",
        "reviews.title": "Отзывы Гостей",
        "reviews.subtitle": "Реальные впечатления путешественников со всего мира",
        "reviews.write_title": "Написать Отзыв",
        "reviews.label_name": "Ваше Имя",
        "reviews.label_rating": "Рейтинг",
        "reviews.label_comment": "Ваш Отзыв",
        "reviews.label_photo": "Прикрепить Фото",
        "reviews.btn_submit": "Отправить Отзыв",
        "reviews.alert_success": "Спасибо за ваш комментарий!",
        "reviews.alert_error": "Ошибка отправки отзыва. Пожалуйста, попробуйте еще раз.",
        "reviews.review1_text": "\"Настоящая жемчужина Хивы! Расположение внутри Ичан-Калы идеальное. Завтрак на крыше с видом на минареты стал главным событием нашей поездки. Очень рекомендую!\"",
        "reviews.review1_author": "Сара Дженкинс",
        "reviews.review2_text": "\"Семья, управляющая этим местом, очень теплая и гостеприимная. Номер был чистым, просторным и оформленным в красивом традиционном стиле. Обязательно вернемся.\"",
        "reviews.review2_author": "Марк Дюбуа",
        "reviews.review3_text": "\"Отличное соотношение цены и качества. Расположение непревзойденное, всего в нескольких шагах от основных достопримечательностей. Персонал помог нам организовать тур по крепостям, это было потрясающе.\"",
        "reviews.review3_author": "Елена К.",
        "map.title": "Найти Нас",
        "map.address": "Внутри стен Старого Города",

        // FAQ SECTION
        "faq.title": "Часто Задаваемые Вопросы",
        "faq.q1": "Завтрак включен?",
        "faq.a1": "Да, вкусный традиционный завтрак (шведский стол) включен в стоимость. Время: с 07:30 до 10:00.",
        "faq.q2": "Есть ли трансфер из аэропорта?",
        "faq.a2": "Да, мы можем организовать частный трансфер из аэропорта или вокзала Ургенча за дополнительную плату.",
        "faq.q3": "Какое время заезда и выезда?",
        "faq.a3": "Заезд с 14:00, выезд до 12:00. Ранний заезд возможен при наличии мест.",
        "faq.q4": "Какие есть бесплатные услуги?",
        "faq.a4": "Wi-Fi, Приветственный напиток, Сейф, Поднос багажа, Помощь в бронировании Ж/Д и Авиабилетов.",

        // ROOMS PAGE
        "rooms.hero_title": "Наши Номера",
        "rooms.hero_subtitle": "Комфорт и традиции",
        "rooms.double_title": "Двухместный Номер (Double)",
        "rooms.double_desc": "Идеально подходит для пар. Большая двуспальная кровать, ванная комната и кондиционер.",
        "rooms.twin_title": "Двухместный Номер (Twin)",
        "rooms.twin_desc": "Идеально для друзей. Две отдельные односпальные кровати со всеми удобствами.",
        "rooms.triple_title": "Трехместный Номер",
        "rooms.triple_desc": "Отлично подходит для небольших семей или групп. Три кровати и просторная зона.",
        "rooms.twin_balcony_title": "Номер с Балконом (Twin)",
        "rooms.twin_balcony_desc": "Наслаждайтесь видом с собственного балкона. Две кровати, современные удобства.",
        "rooms.double_balcony_title": "Номер с Балконом (Double)",
        "rooms.double_balcony_desc": "Романтический номер с частным балконом с видом на город.",
        "rooms.view_details": "Подробнее",

        // TOURS PAGE
        "tours.hero_title": "Откройте для себя Хиву",
        "tours.hero_subtitle": "Эксклюзивные туры, подобранные для вас",
        "tours.section_title": " Наш Эксклюзивные Туры",
        "tours.section_subtitle": "Забронируйте незабываемые приключения по Хиве и Узбекистану.",
        "tours.khiva_title": "Тур по городу Хива",
        "tours.khiva_desc": "Исследуйте древнюю Ичан-Калу с профессиональным гидом. Посетите минареты, медресе и музеи.",
        "tours.aral_title": "Приключение на Аральском Море",
        "tours.aral_desc": "2-дневное путешествие к кладбищу кораблей и Аральскому морю. Включает ночевку в юрте.",
        "tours.castles_title": "Пустынные Замки (Эллик Кала)",
        "tours.castles_desc": "Посетите древние крепости Топрак-Кала, Аяз-Кала и Кызыл-Кала в пустыне.",
        "tours.transfer_tour_desc": "Комфортабельный транспорт для посещения древних крепостей Хорезма.",
        "tours.view_details": "Подробнее",

        // TOUR CARDS (tours.html)
        "tours.card_day_title": "Однодневные поездки",
        "tours.card_day_desc": "Специальные однодневные поездки в древние крепости и места паломничества вокруг Хивы.",
        "tours.card_transfer_title": "Трансферы",
        "tours.card_transfer_desc": "Комфортные и безопасные услуги трансфера из аэропорта/вокзала в отель.",
        "tours.card_aral_title": "Приключения на Аральском море",
        "tours.card_aral_desc": "Двухдневная поездка на Кладбище кораблей в Муйнаке и места экотуризма Аральского моря.",
        "tours.card_khiva_title": "Пешая экскурсия по Хиве",
        "tours.card_khiva_desc": "Откройте для себя историческое и культурное наследие Ичан-Калы с квалифицированным гидом.",
        "tours.btn_book": "Запросить Услугу",
        "tours.btn_view": "Подробнее",
        "tours.view_gallery": "Смотреть Галерею",

        // ARAL SEA TOUR DETAILS (aral_sea.html)
        "tour_aral.title": "Приключения на Аральском море: Кладбище кораблей",
        "tour_aral.subtitle": "Насыщенная однодневная поездка, чтобы увидеть Кладбище кораблей и культуру Каракалпакстана.",
        "tour_aral.section_title": " Хива - Муйнак - Хива (1-дневный тур)",
        "tour_aral.desc": "Эта долгая поездка охватывает зону экологического бедствия и ключевые культурные достопримечательности, включая музей Нукуса.",
        "tour_aral.details_title": "Детали Тура и Основные Моменты:",
        "tour_aral.route_label": "Маршрут:",
        "tour_aral.route_text": "Чилпык Дахма - Музей Нукуса - Музей Аральского моря - Кладбище кораблей - Некрополь Миздакхан.",
        "tour_aral.start_time": "Рекомендуемое время начала: 06:00 (необходим ранний старт).",
        "tour_aral.duration": "Общая продолжительность: Ок. 14–16 часов.",
        "tour_aral.driving_time": "Время в пути: 9–10 часов.",
        "tour_aral.mizdakhan": "Некрополь Миздакхан: Древний погребальный комплекс 9 века.",
        "tour_aral.nukus": "Музей Нукуса: Знаменит своей коллекцией советского авангарда.",
        "tour_aral.price": "Цена Седана (1-3 чел): $110.",
        "tour_aral.logistics_label": "Логистика:",
        "tour_aral.logistics_text": "Включено: Водитель, авто (с кондиционером), топливо и вода. Обед обычно организуется в Нукусе.",

        // ARAL SEA OPTIONS (Russian)
        "aral.options_title": "Варианты Тура на Аральское Море",
        "aral.options_desc": "Мы предлагаем четыре уникальных варианта экспедиции на Аральское море.",
        "aral.label_route": "Маршрут:",
        "aral.label_duration": "Длительность:",
        "aral.label_sightseeing": "Время на осмотр:",
        "aral.label_driving": "Время в пути:",
        "aral.label_included": "Включено:",
        "aral.label_start": "Старт:",
        "aral.label_not_included": "Не включено:",
        "aral.read_more": "Читать Далее",
        "aral.intro_happy": "Мы рады предложить этот тур!!!",
        "aral.history_intro": "Когда-то одно из крупнейших внутренних озер в мире, Аральское море значительно уменьшилось за последние десятилетия. Расположенное в Центральной Азии, оно граничит с Казахстаном на севере и Узбекистаном на юге. Исторически Аральское море было важным источником воды и рыбы для окружающих районов, но с 1960-х годов оно высыхает из-за отвода рек, питавших его, в частности Амударьи и Сырдарьи, для ирригации в советское время. В результате уровень воды в Аральском море резко упал, а его объем уменьшился почти на 90%.",
        "aral.itinerary": "Программа Тура",
        "aral.day_1": "1-й День",
        "aral.day_2": "2-й День",
        "aral.notes_title": "Заметки для Посетителей",
        "aral.booking_desc": "Чтобы забронировать любой из этих вариантов, свяжитесь с нами напрямую. Укажите «Вариант 1, 2, 3 или 4».",

        "aral.note_drivers": "Водители будут останавливаться в туристических местах, чтобы вы могли сделать фото.",
        "aral.note_mobile": "Мобильные устройства, камеры и видеокамеры можно зарядить в юртовом лагере.",
        "aral.note_cold": "Утром и вечером на берегу моря холодно. Возьмите свитер или куртку.",
        "aral.note_illness": "Если у вас есть хронические заболевания, не забудьте свои лекарства.",
        "aral.note_water": "Всегда имейте при себе воду.",
        "aral.note_guide": "Держитесь ближе к вашему гиду и автомобилю.",
        "aral.note_cliff": "Стойте не менее чем в 2 метрах от края плато Устюрт.",
        "aral.note_excluded_val": "Входные билеты, обед, гид ($150) и т.д.",

        // Prices
        "price.1pax_500": "1 Чел: $500",
        "price.2pax_540": "2 Чел: $540",
        "price.3pax_580": "3 Чел: $580",
        "price.4pax_620": "4 Чел: $620",
        // Option 3 Prices
        "price.1pax_550": "1 Чел: $550",
        "price.2pax_590": "2 Чел: $590",
        "price.3pax_630": "3 Чел: $630",
        "price.4pax_670": "4 Чел: $670",
        // Option 2 Prices (New)
        "price.opt2_1pax": "1 Чел: $580",
        "price.opt2_2pax": "2 Чел: $620",
        "price.opt2_3pax": "3 Чел: $660",
        "price.opt2_4pax": "4 Чел: $700",

        // Option 4 Prices (New)
        "price.opt4_1pax": "1 Чел: $490",
        "price.opt4_2pax": "2 Чел: $530",
        "price.opt4_3pax": "3 Чел: $570",
        "price.opt4_4pax": "4 Чел: $610",

        "price.1pax_470": "1 Чел: $470",
        "price.2pax_510": "2 Чел: $510",
        "price.3pax_550": "3 Чел: $550",
        "price.4pax_590": "4 Чел: $590",

        // Option 1
        "aral.opt1_title": "Вариант 1: Приключение на Аральском Море (Классика)",
        "aral.opt1_route_text": "Хива - Чильпык-Кала - Музей Нукуса - Музей Истории Муйнака - Кладбище Кораблей - Каньоны Устюрта - Гробницы Кочевников - Ночевка на берегу Арала - Курганча-Кала - Некрополь Миздакхан - Нукус - Хива",
        "aral.opt1_dur_val": "2 дня и 1 ночь",
        "aral.opt1_sight_val": "6-8 часов",
        "aral.opt1_drive_val": "16-18 часов",
        "aral.opt1_inc_val": "Транспорт (4WD и Седан с водителем), Проживание в Юртовом Лагере, Ужин и Завтрак.",
        "aral.opt1_start_val": "06:00 (Рекомендуется)",
        "aral.opt1_d1_1": "Рекомендуется начать рано утром в 6:00. Начало и конец в Хиве на седане.",
        "aral.opt1_d1_2": "Посещение Чильпык-Кала.",
        "aral.opt1_d1_3": "Музей Искусств им. Савицкого (Нукус).",
        "aral.opt1_d1_4": "Прибытие в Муйнак, обед в местном кафе.",
        "aral.opt1_d1_5": "Краеведческий музей Муйнака и просмотр видео об истории некогда процветающего Муйнака.",
        "aral.opt1_d1_6": "Посещение Кладбища Кораблей.",
        "aral.opt1_d1_7": "Начало поездки к Аральскому морю на внедорожнике.",
        "aral.opt1_d1_8": "Обзор впечатляющих каньонов плато Устюрт, космический пейзаж, посещение гробниц кочевников.",
        "aral.opt1_d1_9": "Прибытие к Аральскому морю около 18:30. Прогулка по берегу, гости могут искупаться в море.",
        "aral.opt1_d1_10": "Прибытие в юртовый лагерь на берегу Аральского моря. В лагере есть душ с чистой пресной водой и туалет.",
        "aral.opt1_d1_11": "19:30 ужин в столовой и завтрак на следующий день в 7:00.",
        "aral.opt1_d2_1": "Не пропустите восход солнца над Аральским морем.",
        "aral.opt1_d2_2": "07:00 Завтрак.",
        "aral.opt1_d2_3": "08:00 Выезд в обратный путь.",
        "aral.opt1_d2_4": "Посещение Курганча-кала (XII-XVI вв.), укрепленного торгового поста на Великом Шелковом Пути.",
        "aral.opt1_d2_5": "Прибытие в Муйнак, смена внедорожника на седан и остановка на обед по пути в местном кафе.",
        "aral.opt1_d2_6": "Посещение архитектурного комплекса Некрополь Миздакхан (XIV в.).",
        "aral.opt1_d2_7": "И возвращение в Хиву (по желанию Нукус, Ургенч, аэропорт), конец.",

        // Option 2
        "aral.opt2_title": "Вариант 2: Аральское Море и Судочье (Расширенный)",
        "aral.opt2_route_text": "Хива - Чильпык - Нукус - Муйнак - Кладбище Кораблей - Каньоны Устюрта - Гробницы Кочевников - Ночевка на Арале - Курганча-Кала - Кубла-Устюрт, Озеро Судочье, Урга - Миздакхан - Нукус - Хива",
        "aral.opt2_dur_val": "2 дня и 1 ночь",
        "aral.opt2_sight_val": "6-8 часов",
        "aral.opt2_drive_val": "16-18 часов",
        "aral.opt2_inc_val": "Транспорт (4WD и Седан с водителем), Проживание в Юртовом Лагере, Ужин и Завтрак.",
        "aral.opt2_start_val": "06:00 (Рекомендуется)",
        "aral.opt2_d1_1": "Рекомендуется начать рано утром в 6:00. Начало и конец в Хиве на седане.",
        "aral.opt2_d1_2": "Посещение Чильпык-Кала.",
        "aral.opt2_d1_3": "Музей Искусств им. Савицкого (Нукус).",
        "aral.opt2_d1_4": "Начало и конец джип-тура из Нукуса.",
        "aral.opt2_d1_5": "Прибытие в Муйнак, обед в местном кафе.",
        "aral.opt2_d1_6": "Краеведческий музей Муйнака и просмотр видео об истории.",
        "aral.opt2_d1_7": "Посещение Кладбища Кораблей.",
        "aral.opt2_d1_8": "Обзор каньонов Устюрта, гробниц кочевников.",
        "aral.opt2_d1_9": "Прибытие к Аральскому морю около 18:30. Прогулка, купание.",
        "aral.opt2_d1_10": "Прибытие в юртовый лагерь. Душ, туалет доступны.",
        "aral.opt2_d1_11": "19:30 Ужин, завтрак в 7:00.",
        "aral.opt2_d2_1": "Не пропустите восход солнца.",
        "aral.opt2_d2_2": "07:00 Завтрак.",
        "aral.opt2_d2_3": "08:00 Выезд.",
        "aral.opt2_d2_4": "Посещение Курганча-кала (XII-XVI вв.).",
        "aral.opt2_d2_5": "Посещение поселка Кубла-Устюрт (заброшенный советский город).",
        "aral.opt2_d2_6": "Урга (заброшенная рыбацкая деревня) на озере Судочье.",
        "aral.opt2_d2_7": "Орнитологический заказник 'Судочье' (наблюдение за птицами, фламинго и др.).",
        "aral.opt2_d2_8": "Посещение комплекса Миздакхан.",
        "aral.opt2_d2_9": "Прибытие в Нукус, смена на седан и возвращение в Хиву (или аэропорт), конец.",

        // Option 3
        "aral.opt3_title": "Вариант 3: Приключение на Аральском Море (через Кунград)",
        "aral.opt3_route_text": "Хива - Чильпык - Нукус - Муйнак - Кладбище Кораблей - Устюрт - Гробницы Кочевников - Арал - Курганча-Кала - Кубла-Устюрт, Судочье, Урга - Миздакхан - Нукус - Хива",
        "aral.opt3_dur_val": "2 дня и 1 ночь",
        "aral.opt3_sight_val": "6-8 часов",
        "aral.opt3_drive_val": "16-18 часов",
        "aral.opt3_inc_val": "Транспорт (4WD и Седан с водителем), Проживание в Юртовом Лагере, Ужин и Завтрак.",
        "aral.opt3_d1_1": "Рекомендуется начать в 6:00. Старт/Финиш в Хиве.",
        "aral.opt3_d1_2": "Посещение Чильпык-Кала.",
        "aral.opt3_d1_3": "Музей Нукуса.",
        "aral.opt3_d1_4": "Прибытие в Муйнак, обед.",
        "aral.opt3_d1_5": "Старт из Муйнака на внедорожнике.",
        "aral.opt3_d1_6": "Музей Муйнака и видео.",
        "aral.opt3_d1_7": "Кладбище Кораблей.",
        "aral.opt3_d1_8": "Каньоны Устюрта, гробницы кочевников.",
        "aral.opt3_d1_9": "Прибытие к морю в 18:30.",
        "aral.opt3_d1_10": "Заселение в юртовый лагерь.",
        "aral.opt3_d1_11": "19:30 Ужин, завтрак в 7:00.",
        "aral.opt3_d2_1": "Восход солнца.",
        "aral.opt3_d2_2": "07:00 Завтрак.",
        "aral.opt3_d2_3": "08:00 Выезд.",
        "aral.opt3_d2_4": "Курганча-кала (XII-XVI вв.).",
        "aral.opt3_d2_5": "Посещение Кубла-Устюрт.",
        "aral.opt3_d2_6": "Урга.",
        "aral.opt3_d2_7": "Заказник 'Судочье'.",
        "aral.opt3_d2_8": "Некрополь Миздакхан.",
        "aral.opt3_d2_9": "Прибытие в Кунград, смена на седан и возвращение в Хиву, конец.",

        // Option 4
        "aral.opt4_title": "Вариант 4: Из Нукуса на Аральское Море (Только 4WD)",
        "aral.opt4_route_text": "Нукус - Миздакхан - Музей Муйнака - Кладбище Кораблей - Устюрт - Гробницы Кочевников - Арал - Курганча-Кала - Кубла-Устюрт - Судочье - Урга - Нукус",
        "aral.opt4_dur_val": "2 дня и 1 ночь",
        "aral.opt4_sight_val": "6-8 часов",
        "aral.opt4_drive_val": "12-14 часов",
        "aral.opt4_inc_val": "Транспорт (4WD с водителем), Проживание в Юртовом Лагере, Ужин и Завтрак.",
        "aral.opt4_start_val": "06:00 (Рекомендуется)",
        "aral.opt4_d1_1": "Старт из Нукуса на внедорожнике.",
        "aral.opt4_d1_2": "Посещение комплекса Миздакхан.",
        "aral.opt4_d1_3": "Прибытие в Муйнак, обед.",
        "aral.opt4_d1_4": "Музей Муйнака и видео.",
        "aral.opt4_d1_5": "Кладбище Кораблей.",
        "aral.opt4_d1_6": "Каньоны Устюрта, гробницы кочевников.",
        "aral.opt4_d1_7": "Прибытие к морю, прогулка.",
        "aral.opt4_d1_8": "Заселение в юртовый лагерь.",
        "aral.opt4_d1_9": "19:30 Ужин, завтрак в 7:00.",
        "aral.opt4_d2_1": "Восход солнца.",
        "aral.opt4_d2_2": "07:00 Завтрак.",
        "aral.opt4_d2_3": "08:00 Выезд.",
        "aral.opt4_d2_4": "Курганча-кала.",
        "aral.opt4_d2_5": "Кубла-Устюрт.",
        "aral.opt4_d2_6": "Урга.",
        "aral.opt4_d2_7": "Заказник 'Судочье'.",
        "aral.opt4_d2_8": "Прибытие в Нукус, конец.",


        // KHIVA TOUR DETAILS
        "tour_khiva.title": "Пешая Экскурсия по Хиве",
        "tour_khiva.subtitle": "Откройте для себя секреты Ичан-Калы, внутреннего города Всемирного наследия ЮНЕСКО.",
        "tour_khiva.section_title": "Исследуйте Вечную Ичан-Калу",
        "tour_khiva.desc": "Прогуляйтесь по историческому сердцу Хивы, изучая ее потрясающие минареты, мечети и медресе. Погрузитесь в историю и культуру этого древнего центра Центральной Азии.",
        "tour_khiva.highlights_title": "Основные Моменты Пешей Экскурсии:",
        "tour_khiva.highlight_1": "Минарет Кальта-Минар и Медресе Мухаммад Амин-хана.",
        "tour_khiva.highlight_2": "Джума Мечеть (Пятничная мечеть) с ее уникальными деревянными колоннами.",
        "tour_khiva.highlight_3": "Куня-Арк (Старая Цитадель) и Дворец Таш-Хаули.",
        "tour_khiva.booking_note": "Бронирование:",
        "tour_khiva.booking_info": "Квалифицированный местный гид доступен по запросу. Услуги гида оплачиваются отдельно (примерно $70–$80).",

        // KHIVA TOUR PROGRAM (Russian)
        "khiva.program_title": "ПРОГРАММА",
        "khiva.morning_title": "УТРО: Легенды Ханов (09:00 - 13:00)",
        "khiva.morning_1": "09:00: Встреча с гидом в отеле. Начало экскурсии у Западных ворот (Ота Дарвоза).",
        "khiva.morning_2": "Минарет Кальта-Минар: Знаменитая незаконченная голубая башня.",
        "khiva.morning_3": "Медресе Мухаммад Амин-хана: Самое большое средневековое медресе в Центральной Азии.",
        "khiva.morning_4": "Куня-Арк: Древняя цитадель внутри крепости.",
        "khiva.lunch_title": "Обед (13:00 - 14:00)",
        "khiva.lunch_desc": "Перерыв на обед в традиционной чайхане, чтобы попробовать Шивит Оши.",
        "khiva.afternoon_title": "ДЕНЬ: Духовная и Ремесленная Хива (14:00 - 16:00)",
        "khiva.afternoon_1": "Джума Мечеть: Шедевр резьбы по дереву с 213 уникальными колоннами.",
        "khiva.afternoon_2": "Мавзолей Пахлаван Махмуда: Самое священное место в Хиве.",
        "khiva.afternoon_3": "Минарет Ислам Ходжа: Самый высокий минарет в Хиве.",
        "khiva.price_title": "Цена Тура",
        "khiva.price_desc": "Это частный тур с гидом. Цена указана за группу, а не за человека.",
        "khiva.price_val": "$70 (Услуги Гида)",


        // FORTRESS DAY TRIPS (private_day.html)
        "tour_day.title": "Тур по Древним Крепостям Хорезма",
        "tour_day.subtitle": "Исследуйте регион Эллик Кала, известный остатками тысяч древних крепостей и дворцов.",
        "tour_day.section_title": "Однодневные Поездки в Крепости",
        "tour_day.desc": "Выберите лучший вариант для вашего времени и интересов. Все туры начинаются и заканчиваются в вашем отеле в Хиве. Время начала гибкое (с 09:00 до 16:00).",
        "tour_day.table_name": "Название Тура",
        "tour_day.table_fortresses": "Посещаемые Крепости",
        "tour_day.table_duration": "Длительность",
        "tour_day.table_price_sedan": "Седан (1-3 чел)",
        "tour_day.table_price_suv": "Внедорожник (1-4 чел)",
        "tour_day.table_price_minivan": "Минивэн (4-6 чел)",
        "tour_day.3_fortresses": "Тур Три Крепости",
        "tour_day.5_fortresses": "Тур Пять Крепостей",
        "tour_day.7_fortresses": "Тур Семь Крепостей",
        "tour_day.9_fortresses": "Тур Девять Крепостей",
        "tour_day.nukus_museum": "Тур в Музей Нукуса",
        "tour_day.nukus_mizdakhan": "Музей Нукуса и Некрополь Миздакхан",
        "tour_day.muynak": "Тур на Кладбище Кораблей (Муйнак)",
        "tour_day.nukus_fort": "Музей Нукуса через Крепости",
        "tour_day.approx_hours": "Ок. %s часов",
        "tour_day.details_label": "Детали Тура:",
        "tour_day.details_text": "Включено: Водитель, топливо и вода. Не включено: Билеты, обед, гид ($70–$80). В Аяз-Кале можно посетить юртовый лагерь и покататься на верблюдах.",
        "tour_day.table_price_minibus": "Микроавтобус (1-10 чел)",
        "tour_day.features_3": "Кызыл-Кала, Топрак-Кала, Озеро Акча, Аяз-Кала",
        "tour_day.features_5": "Три Крепости + Озеро Акча, Гулдурсун-Кала, Кой-Крылган-Кала",
        "tour_day.features_7": "Пять Крепостей + Озеро Акча, Анга-Кала, Джанбас-Кала",
        "tour_day.features_9": "Семь Крепостей + Озеро Акча, Большая Кырк-Кыз-Кала + Кургашин-Кала",
        "tour_day.features_nukus": "Музей Нукуса, Чильпык-Кала",
        "tour_day.features_nukus_miz": "Чильпык-Кала, Музей Нукуса, Некрополь Миздакхан",
        "tour_day.features_muynak": "Чильпык-Кала, Музей Нукуса, Музей Аральского моря, Кладбище кораблей, Некрополь Миздакхан, Нукус",
        "tour_day.features_nukus_fort": "Музей Нукуса + Чильпык-Кала + Три Крепости + Озеро Акча",
        "tour_day.badai_tugai_title": "Бадай-Тугай + Три Крепости",
        "tour_day.features_badai": "Бадай-Тугай, Кызыл-Кала, Топрак-Кала, Озеро Акча, Аяз-Кала",

        // PRIVATE TRANSFERS (private_transfer.html)
        "fleet.title": "Наш Автопарк",
        "fleet.sedan_title": "Стандартный Седан",
        "fleet.sedan_capacity": "До 3 чел. • 2 Чемодана",
        "fleet.suv_title": "Внедорожник (SUV)",
        "fleet.suv_capacity": "До 4 чел. • 3 Чемодана",
        "fleet.minivan_title": "Минивэн",
        "fleet.minivan_capacity": "До 6 чел. • 6 Чемоданов",
        "fleet.minibus_title": "Микроавтобус",
        "fleet.minibus_capacity": "До 10-14 Чел.",
        "transfers.title": "Частные Трансферы: Экскурсионные Маршруты",
        "transfers.subtitle": "Превратите долгую поездку в увлекательное путешествие, посетив древние крепости между городами.",
        "transfers.section_title": "Связующие Туры: Хива ↔ Нукус / Хива ↔ Бухара",
        "transfers.section_desc": "Наслаждайтесь комфортабельным трансфером с остановками для осмотра достопримечательностей. Время выезда гибкое, рекомендуемое начало в 8:00 утра.",
        "transfers.standard_title": "Стандартные Трансферы (Точка-в-Точку)",
        "transfers.sightseeing_title": "Экскурсионные Связующие Туры",
        "transfers.route": "Маршрут",
        "transfers.stops": "Остановки",
        "transfers.alert_label": "Внимание:",
        "transfers.alert_text": "Музей Нукуса закрыт каждый понедельник. Билеты, обед, гид и катание на верблюдах не включены в стоимость.",
        "transfers.route_railway": "Ж/Д Вокзал Хивы ↔ Отель",
        "transfers.route_urgench": "Хива ↔ Аэропорт/Ж/Д Вокзал Ургенча",
        "transfers.route_shavat": "Хива ↔ Шават (Граница с Туркменистаном)",
        "transfers.route_nukus": "Хива ↔ Нукус",
        "transfers.route_bukhara": "Хива ↔ Бухара",
        "transfers.route_nukus": "Хива ↔ Нукус",
        "transfers.route_nukus_3": "Хива ↔ Нукус (Три Крепости)",
        "transfers.route_nukus_4": "Хива ↔ Нукус (Четыре Крепости)",
        "transfers.route_bukhara_3": "Хива ↔ Бухара (Три Крепости)",
        "transfers.stops_nukus": "Хива, Чильпык-Кала, Нукус",
        "transfers.stops_nukus_3": "Аяз-Кала, Топрак-Кала, Кызыл-Кала + Озеро Акча",
        "transfers.stops_nukus_4": "Хива, Три Крепости, Чильпык-Кала + Озеро Акча, Нукус",
        "transfers.stops_bukhara_3": "Кызыл-Кала, Топрак-Кала, Аяз-Кала + Озеро Акча",
        "transfers.route_nukus_badai": "Хива - Бадай-Тугай - Нукус (Три Крепости)",
        "transfers.stops_nukus_badai": "Хива, Аяз-Кала, Озеро Акча, Топрак-Кала, Кызыл-Кала, Заповедник Бадай-Тугай, Нукус",
        "transfers.route_bukhara_4": "Хива - Бухара (Четыре Крепости)",
        "transfers.stops_bukhara_4": "Хива, Три Крепости, Большая Гульдурсун-Кала + Озеро Акча, Бухара",
        "transfers.route_nukus_gaur": "Хива - Бадай-Тугай - Нукус (Три Крепости)",
        "transfers.stops_nukus_gaur": "Хива, Гяур-Кала, Джампык-Кала, Заповедник Бадай-Тугай, Чильпык-Кала, Нукус",
        "transfers.stops_bukhara_4": "Хива, Три Крепости, Большая Гулдурсун-Кала + Озеро Акча, Бухара",

        // COMMON & FORM
        "rooms.section_title": "Наши Номера",
        "rooms.price_from": "$50  ($35 1 чел.)",
        "rooms.price_triple": "$80  ($60 2 чел.),($40 1 чел.)",
        "rooms.price_balcony": "$60  ($45 1 чел.)",
        "rooms.per_night": "ночь",
        "form.details_title": "Ваши Данные и Бронирование",
        "form.full_name": "Полное Имя",
        "form.email": "Электронная Почта",
        "form.phone": "Номер Телефона (Необязательно)",
        "form.check_in": "Дата Заезда *",
        "form.check_out": "Дата Выезда *",
        "form.adults": "Взрослые",
        "form.children": "Дети",
        "form.children_policy": "Дети до 5 лет бесплатно, до 12 лет скидка 50%.",
        "form.room_selection": "Выберите Тип Номера",
        "form.quantity": "Количество:",
        "form.notes": "Дополнительные Примечания (Необязательно)",
        "form.btn_book": "Отправить Запрос",
        "form.alert_select_room": "Пожалуйста, выберите хотя бы один тип номера и количество.",
        "form.success": "Запрос на бронирование успешно отправлен!",
        "form.error": "Не удалось отправить запрос. Пожалуйста, попробуйте снова.",

        // FORM PLACEHOLDERS
        "form.ph_name": "Иван Иванов",
        "form.ph_email": "vashe@email.com",
        "form.ph_phone": "+998 90 123 45 67",
        "form.ph_notes": "Например: Я хотел бы номер с лучшим видом.",

        // REVIEWS PLACEHOLDERS & OPTIONS
        "reviews.ph_name": "Иван Иванов",
        "reviews.ph_comment": "Поделитесь своими впечатлениями...",
        "reviews.opt_excellent": "⭐⭐⭐⭐⭐ (Отлично)",
        "reviews.opt_good": "⭐⭐⭐⭐ (Хорошо)",
        "reviews.opt_average": "⭐⭐⭐ (Средне)",
        "reviews.opt_poor": "⭐⭐ (Плохо)",
        "reviews.opt_terrible": "⭐ (Ужасно)",

        // DINING PAGE (Russian Translations)
        "menu.cat_national": "Национальные Блюда (Хорезм)",
        "menu.cat_soups": "Супы и Сытные Блюда",
        "menu.cat_salads": "Салаты и Закуски",
        "menu.cat_drinks": "Напитки и Десерты",

        "menu.shivit": "Шивит Оши",
        "menu.desc_shivit": "Фирменная хивинская зеленая лапша с укропом, мясным рагу и йогуртом.",
        "menu.tuxum_barak": "Тухум Барак",
        "menu.desc_tuxum_barak": "Уникальные квадратные вареники с яйцом, местный деликатес.",
        "menu.palov": "Плов (По-Хорезмски)",
        "menu.desc_palov": "Традиционный плов с желтой морковью и нежной говядиной (легкий и ароматный).",
        "menu.manti": "Манты",
        "menu.desc_manti": "Приготовленные на пару вареники с рубленым мясом и луком.",
        "menu.gumma": "Гумма",
        "menu.desc_gumma": "Жареные пирожки с мясом и специями, лучше всего подавать горячими.",

        "menu.soup_barak": "Суп Барак",
        "menu.desc_soup_barak": "Миниатюрные пельмени в насыщенном бульоне.",
        "menu.tefteli": "Суп с Тефтелями",
        "menu.desc_tefteli": "Сытный овощной суп с нежными фрикадельками.",
        "menu.special_soup": "Кайнатма Шурва",
        "menu.desc_special_soup": "Традиционный наваристый суп с нежным мясом и овощами, приготовленный на медленном огне.",
        "menu.shashlik": "Ассорти Шашлыков",
        "menu.desc_shashlik": "Сочные шашлыки: Говядина, Баранина или Курица, подается с луком.",
        "menu.galubsi": "Голубцы",
        "menu.desc_galubsi": "Капустные листья или перец, фаршированные мясом и рисом.",
        "menu.somsa": "Самса",
        "menu.desc_somsa": "Запеченная в духовке слоеная выпечка с мясом или тыквой.",

        "menu.achichuk": "аччик-чучук (салат из помидоров)",
        "menu.desc_achichuk": "Традиционный салат из тонко нарезанных помидоров и лука (острый).",
        "menu.garden_salad": "Сезонный Салат",
        "menu.desc_garden_salad": "Свежая смесь огурцов, помидоров и местной зелени.",
        "menu.caesar": "Цезарь",
        "menu.desc_caesar": "Классический салат с сухариками, пармезаном и сливочным соусом.",
        "menu.eggplant": "Салат из Баклажанов + вареный рис",
        "menu.desc_eggplant": "Запеченные баклажаны с чесноком и травами.",
        "menu.qapshirma": "Капширма",
        "menu.desc_qapshirma": "Жареное слоеное тесто, вкусная местная закуска.",

        "menu.tea": "Чай (Зеленый/Черный)",
        "menu.desc_tea": "Подается в чайнике с лимоном или мятой.",
        "menu.juice": "Свежевыжатые Соки",
        "menu.desc_juice": "Яблоко, Морковь, Апельсин, Арбуз (сезонно).",
        "menu.wine": "Вино и Пиво",
        "menu.desc_wine": "Выбор местных и импортных напитков.",
        "menu.cocktail": "Коктейли",
        "menu.desc_cocktail": "Мохито, Джин-тоник и другие освежающие напитки.",
        "menu.page_indicator": "Страница %s из %s",
    },
};

/* =================================================
   5. LANGUAGE SWITCHER LOGIC
   ================================================= */
function initLanguageSwitcher() {
    const langToggleBtn = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');

    // Check saved language or default 'en'
    let currentLang = localStorage.getItem('selectedLang') || 'en';
    applyLanguage(currentLang);

    if (langToggleBtn && langDropdown) {
        // Toggle Dropdown
        langToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!langToggleBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        // Handle Language Selection
        const langLinks = langDropdown.querySelectorAll('a');
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');

                // If English is selected, reload the page to restore original HTML content
                if (lang === 'en') {
                    localStorage.setItem('selectedLang', 'en');
                    location.reload();
                    return;
                }

                currentLang = lang;
                localStorage.setItem('selectedLang', lang);
                applyLanguage(lang);
                langDropdown.classList.remove('show'); // Close dropdown
            });
        });
    }
}

function applyLanguage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // 2. Handle Placeholders (New)
    const placeholders = document.querySelectorAll('[data-i18n-ph]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang] && translations[lang][key]) {
            el.setAttribute('placeholder', translations[lang][key]);
        }
    });

    // 3. Handle Select Options (New) - for Rating
    const options = document.querySelectorAll('option[data-i18n-opt]');
    options.forEach(el => {
        const key = el.getAttribute('data-i18n-opt');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
}

/* ================================================= */
/* === REVIEW SYSTEM & ADMIN PANEL LOGIC === */
/* ================================================= */


/* =================================================
   FIREBASE CONFIGURATION & INIT
   ================================================= */
const firebaseConfig = {
    apiKey: "AIzaSyAP8Ag1GMNfXD7oJaSa4hEOEKSecUPqTLY",
    authDomain: "meros-hotel-ed1a3.firebaseapp.com",
    projectId: "meros-hotel-ed1a3",
    storageBucket: "meros-hotel-ed1a3.firebasestorage.app",
    messagingSenderId: "430231968458",
    appId: "1:430231968458:web:1da6699667c1bdd0b23233"
};

// Initialize Firebase (Safe Mode)
let db = null; // Global db variable
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        console.log("Firebase Initialized");
        db = firebase.firestore();
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
} else {
    console.log("Firebase SDK not found on this page. Skipping DB init.");
}


/* =================================================
   6. REVIEW SYSTEM LOGIC (CONNECTED TO FIREBASE)
   ================================================= */
function initReviews() {
    // If db is not initialized, we can't do reviews
    if (!db) return;

    // 1. Handle Photo Preview
    const photoInput = document.getElementById('review-photo');
    const photoPreview = document.getElementById('review-photo-preview');
    const previewImg = document.getElementById('preview-img');

    if (photoInput && photoPreview && previewImg) {
        photoInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    photoPreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                photoPreview.style.display = 'none';
                previewImg.src = '';
            }
        });
    }

    // 2. Handle Review Submission
    const reviewForm = document.getElementById('submission-review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('review-name').value;
            const rating = document.getElementById('review-rating').value;
            const text = document.getElementById('review-text').value;
            const submitBtn = reviewForm.querySelector('button[type="submit"]');

            // Helper to save review
            const processReview = (imageBase64) => {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Sending...";
                }

                const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&rounded=true&size=128`;

                const newReview = {
                    name,
                    rating: parseInt(rating),
                    text,
                    date: new Date().toLocaleDateString(),
                    avatar: avatarUrl,
                    image: imageBase64 || null,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Order by time
                };

                // Add to Firestore 'approved_reviews' (Public Immediately)
                db.collection("approved_reviews").add(newReview)
                    .then((docRef) => {
                        console.log("Review written with ID: ", docRef.id);
                        // Localized Success Message
                        const currentLang = localStorage.getItem('selectedLang') || 'en';
                        alert(translations[currentLang]?.['reviews.alert_success'] || translations['en']['reviews.alert_success']);
                        reviewForm.reset();
                        if (photoPreview) photoPreview.style.display = 'none';
                        loadReviews(); // Refresh the list immediately
                    })
                    .catch((error) => {
                        console.error("Error adding review: ", error);
                        const currentLang = localStorage.getItem('selectedLang') || 'en';
                        alert(translations[currentLang]?.['reviews.alert_error'] || translations['en']['reviews.alert_error']);
                    })
                    .finally(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = submitBtn.getAttribute('data-i18n') === 'reviews.btn_submit' ? "Submit Review" : "Yuborish";
                        }
                    });
            };

            // Check for file
            if (photoInput && photoInput.files && photoInput.files[0]) {
                const file = photoInput.files[0];
                if (file.size > 1 * 1024 * 1024) { // 1MB Limit
                    alert("Image file is too large (Max 1MB).");
                    return;
                }
                const reader = new FileReader();
                reader.onload = function (e) {
                    processReview(e.target.result);
                };
                reader.onerror = function () {
                    alert("Error reading file");
                };
                reader.readAsDataURL(file);
            } else {
                processReview(null);
            }
        });
    }

    loadReviews();
}

function loadReviews() {
    const container = document.getElementById('dynamic-reviews-container');
    if (!container || !db) return; // Check db

    // Load from Firestore 'approved_reviews'
    db.collection("approved_reviews").orderBy("timestamp", "desc").limit(20).get()
        .then((querySnapshot) => {
            container.innerHTML = '';
            if (querySnapshot.empty) {
                // Optional: Show "No reviews yet" message
            }
            querySnapshot.forEach((doc) => {
                const review = doc.data();
                const stars = '<i class="fas fa-star"></i>'.repeat(review.rating);
                const userAvatar = review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random&color=fff&rounded=true`;

                const uploadedImage = review.image
                    ? `<div class="review-image-container" style="margin-bottom:10px; border-radius:8px; overflow:hidden;">
                     <img src="${review.image}" alt="Review Photo" style="width:auto; max-width:100%; height:150px; object-fit:cover; display:block; border-radius: 4px;">
                   </div>`
                    : '';

                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                <div class="review-stars">${stars}</div>
                ${uploadedImage}
                <p class="review-text">"${review.text}"</p>
                <div class="review-author">
                    <img src="${userAvatar}" alt="${review.name}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                    <span>${review.name}</span> <span style="font-size: 0.8em; color: #888; font-weight: normal; margin-left:5px;">вЂў ${review.date}</span>
                </div>
            `;
                container.appendChild(card);
            });
        })
        .catch((error) => {
            console.log("Error getting reviews: ", error);
            // Fallback or silence
        });
}

// --- ADMIN FUNCTIONS ---

async function checkAdminPassword() {
    const input = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('login-error');
    const loginSection = document.getElementById('admin-login');
    const dashboard = document.getElementById('admin-dashboard');

    // SHA-256 Hash of '123456'
    const secretHash = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

    try {
        const msgBuffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex === secretHash) {
            loginSection.style.display = 'none';
            dashboard.style.display = 'block';
            if (db) {
                loadAdminReviews();
                loadAdminStats(); // Load Stats
            }
        } else {
            errorMsg.style.display = 'block';
        }
    } catch (e) {
        console.error("Hashing error:", e);
        errorMsg.textContent = "Security Error. Please use a modern browser.";
        errorMsg.style.display = 'block';
    }
}

function logoutAdmin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
    document.getElementById('admin-password').value = '';
}

function showTab(tabName) {
    document.getElementById('pending-reviews-tab').style.display = tabName === 'pending' ? 'block' : 'none';
    document.getElementById('approved-reviews-tab').style.display = tabName === 'approved' ? 'block' : 'none';
}

function loadAdminReviews() {
    if (!db) return;
    const pendingList = document.getElementById('pending-reviews-list');
    const approvedList = document.getElementById('approved-reviews-list');
    const pendingBtn = document.getElementById('btn-pending');
    const approvedBtn = document.getElementById('btn-approved');

    const renderThumb = (img) => img ? `<img src="${img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; margin-right:10px; border:1px solid #eee;">` : '';

    // Load Pending
    if (pendingList) {
        pendingList.innerHTML = '<p>Loading...</p>';
        db.collection("pending_reviews").orderBy("timestamp", "desc").get().then((snapshot) => {
            pendingList.innerHTML = '';
            if (pendingBtn) pendingBtn.textContent = `Archive/Pending (${snapshot.size})`;

            if (snapshot.empty) {
                pendingList.innerHTML = '<p>No pending reviews.</p>';
            } else {
                snapshot.forEach((doc) => {
                    const r = doc.data();
                    const id = doc.id;
                    pendingList.innerHTML += `
                        <div style="background: #fff; padding: 15px; border: 1px solid #ddd; margin-bottom: 10px; border-radius: 5px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="display:flex; align-items:center;">
                                    ${renderThumb(r.image)}
                                    <div>
                                        <strong>${r.name} <span style="font-weight:normal; font-size:12px; color:#777;">(${r.date})</span></strong>
                                        <br><span style="color:#f1c40f;">${'в…'.repeat(r.rating)}</span>
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 10px 0;">"${r.text}"</p>
                            <button onclick="approveReview('${id}')" class="btn" style="padding: 5px 10px; font-size: 14px; background: #27ae60;">Approve</button>
                            <button onclick="deleteReview('${id}', 'pending')" class="btn" style="padding: 5px 10px; font-size: 14px; background: #c0392b;">Delete</button>
                        </div>
                    `;
                });
            }
        });
    }

    // Load Approved
    if (approvedList) {
        approvedList.innerHTML = '<p>Loading...</p>';
        db.collection("approved_reviews").orderBy("timestamp", "desc").get().then((snapshot) => {
            approvedList.innerHTML = '';
            if (approvedBtn) approvedBtn.textContent = `Live Reviews (${snapshot.size})`;

            if (snapshot.empty) {
                approvedList.innerHTML = '<p>No approved reviews yet.</p>';
            } else {
                snapshot.forEach((doc) => {
                    const r = doc.data();
                    const id = doc.id;
                    approvedList.innerHTML += `
                        <div style="background: #fff; padding: 15px; border: 1px solid #ddd; margin-bottom: 10px; border-radius: 5px;">
                             <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="display:flex; align-items:center;">
                                    ${renderThumb(r.image)}
                                    <div>
                                        <strong>${r.name} <span style="font-weight:normal; font-size:12px; color:#777;">(${r.date})</span></strong>
                                        <br><span style="color:#f1c40f;">${'в…'.repeat(r.rating)}</span>
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 10px 0;">"${r.text}"</p>
                            <button onclick="deleteReview('${id}', 'approved')" class="btn" style="padding: 5px 10px; font-size: 14px; background: #c0392b;">Delete</button>
                        </div>
                    `;
                });
            }
        });
    }
}

function approveReview(id) {
    if (!db) return;
    db.collection("pending_reviews").doc(id).get().then((doc) => {
        if (doc.exists) {
            const data = doc.data();
            db.collection("approved_reviews").add(data).then(() => {
                db.collection("pending_reviews").doc(id).delete().then(() => {
                    alert("Review Approved!");
                    loadAdminReviews();
                });
            });
        }
    });
}

function deleteReview(id, type) {
    if (!db) return;
    if (!confirm("Are you sure?")) return;
    const collectionName = type === 'pending' ? 'pending_reviews' : 'approved_reviews';

    db.collection(collectionName).doc(id).delete().then(() => {
        loadAdminReviews();
    }).catch((error) => {
        console.error("Error removing document: ", error);
        alert("Error deleting review.");
    });
}

/* ================================================= */
/* === VISITOR TRACKING & STATS LOGIC (FIREBASE) === */
/* ================================================= */

/* ================================================= */
/* === VISITOR TRACKING & STATS LOGIC (FIREBASE) === */
/* ================================================= */

function trackSiteStats() {
    if (!db) {
        console.warn("Firebase DB not initialized, skipping stats.");
        return;
    }

    // SIMPLIFIED: TRACK ONLY TOTAL VISITORS (Unique per session)

    // Check if this user has already visited in this session
    if (!sessionStorage.getItem('visited_session')) {
        console.log("[Stats Info] New Session Detected. Incrementing TOTAL VISITS.");

        // Mark session as visited
        sessionStorage.setItem('visited_session', 'true');

        // Increment only total_visits in Firestore
        db.collection('stats').doc('general').set({
            total_visits: firebase.firestore.FieldValue.increment(1)
        }, { merge: true })
            .then(() => console.log("[Stats Success] Total Visitors incremented."))
            .catch((error) => console.error("Error tracking total stats:", error));
    } else {
        console.log("[Stats Info] Existing Session. No increment.");
    }
}

// --- ADMIN STATS LOADER (Real-time) ---
// --- ADMIN STATS LOADER (Real-time) ---
function loadAdminStats() {
    const totalEl = document.getElementById('stat-total-visits');
    if (!totalEl || !db) return; // Exit if not on admin page

    totalEl.textContent = '...';

    // Listen for real-time updates
    db.collection('stats').doc('general').onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            // Only update Total Visitors
            if (totalEl) totalEl.textContent = data.total_visits || 0;
        } else {
            console.log("No stats document found.");
            if (totalEl) totalEl.textContent = 0;
        }
    }, (error) => {
        console.error("Error receiving stats updates:", error);
    });
}

/* ================================================= */
/* === SCROLL TO TOP & MENU BOOKS LOGIC === */
/* ================================================= */

/* =================================================
   7. SCROLL TOP & DYNAMIC MENU LOGIC
   ================================================= */

// MENU DATA STRUCTURE
const menuData = [
    // PAGE 1
    {
        category_key: "menu.cat_national",
        items: [
            { img: "shivit_oshi.jpg", title_key: "menu.shivit", desc_key: "menu.desc_shivit", price_key: "dining.shivit_price" },
            { img: "tuxum_barak.jpg", title_key: "menu.tuxum_barak", desc_key: "menu.desc_tuxum_barak" },
            { img: "plov.jpg", title_key: "menu.palov", desc_key: "menu.desc_palov", price_key: "dining.plov_price" },
            { img: "manti.jpg", title_key: "menu.manti", desc_key: "menu.desc_manti" },
            { img: "gumma.jpg", title_key: "menu.gumma", desc_key: "menu.desc_gumma" },
            { img: "qapshirma.jpg", title_key: "menu.qapshirma", desc_key: "menu.desc_qapshirma" },
            { img: "shashlik.jpg", title_key: "menu.shashlik", desc_key: "menu.desc_shashlik" },
            { img: "somsa.jpg", title_key: "menu.somsa", desc_key: "menu.desc_somsa" }
        ]
    },
    // PAGE 2
    {
        category_key: "menu.cat_soups",
        items: [
            { img: "soup_barak.jpg", title_key: "menu.soup_barak", desc_key: "menu.desc_soup_barak" },
            { img: "tefteli.jpg", title_key: "menu.tefteli", desc_key: "menu.desc_tefteli" },
            { img: "special_soup.jpg", title_key: "menu.special_soup", desc_key: "menu.desc_special_soup" },
            { img: "galubsi.jpg", title_key: "menu.galubsi", desc_key: "menu.desc_galubsi" }
        ]
    },
    // PAGE 3
    {
        category_key: "menu.cat_salads",
        items: [
            { img: "achichuk.jpg", title_key: "menu.achichuk", desc_key: "menu.desc_achichuk" },
            { img: "garden_salad.jpg", title_key: "menu.garden_salad", desc_key: "menu.desc_garden_salad" },
            { img: "caesar.jpg", title_key: "menu.caesar", desc_key: "menu.desc_caesar" },
            { img: "egplant salad.jpg", fallback_img: "eggplant.jpg", title_key: "menu.eggplant", desc_key: "menu.desc_eggplant" }
        ]
    },
    // PAGE 4
    {
        category_key: "menu.cat_drinks",
        items: [
            { img: "Cups_of_green_and_black_tea_with_mint_on_rustic_table_1000x.webp", fallback_img: "tea.jpg", title_key: "menu.tea", desc_key: "menu.desc_tea" },
            { img: "Featured_Image_1_1.webp", fallback_img: "juice.jpg", title_key: "menu.juice", desc_key: "menu.desc_juice" },
            { img: "images (1).jpg", fallback_img: "wine.jpg", title_key: "menu.wine", desc_key: "menu.desc_wine" },
            { img: "images.jpg", fallback_img: "cocktail.jpg", title_key: "menu.cocktail", desc_key: "menu.desc_cocktail" }
        ]
    }
];

function initScrollAndMenu() {
    /* --- 1. Global Scroll to Top Button --- */
    console.log("initScrollAndMenu started");
    // alert("Code Updated: Dynamic Menu Active. Please wait for menu to load."); // Temporary check

    // Check if menuData exists
    if (typeof menuData === 'undefined') {
        console.error("menuData is undefined!");
    } else {
        console.log("menuData loaded, items:", menuData.length);
    }

    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to Top');
    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show after 300px
            scrollBtn.style.display = 'flex'; // Ensure it's in the DOM flow
            setTimeout(() => scrollBtn.classList.add('visible'), 10);
        } else {
            scrollBtn.classList.remove('visible');
            setTimeout(() => { if (!scrollBtn.classList.contains('visible')) scrollBtn.style.display = 'none'; }, 300);
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* --- 2. Dynamic Menu Pagination & Rendering --- */
    const menuContainer = document.getElementById('menu-container');

    if (menuContainer && typeof menuData !== 'undefined') {
        let currentPage = 0;

        // Function to create HTML for a menu item
        function createMenuItem(item) {
            let imgHtml = item.img ? `<img src="${item.img}" alt="Menu Item" onerror="this.src='${item.fallback_img || 'images/logo-placeholder.png'}'">` : '';
            return `
                <div class="menu-item-card">
                    ${imgHtml}
                    <div class="menu-item-info">
                        <h4 data-i18n="${item.title_key}">Loading...</h4>
                        <p data-i18n="${item.desc_key}">Loading...</p>
                    </div>
                </div>
            `;
        }

        // Render Function
        window.renderMenu = function () {
            // Clear container
            menuContainer.innerHTML = '';

            // Create Page Counter/Nav Container
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'menu-controls';

            // Render Current Page Content
            const pageData = menuData[currentPage];
            if (pageData) {
                // Category Title
                const catTitle = document.createElement('h3');
                catTitle.className = 'page-title';
                catTitle.setAttribute('data-i18n', pageData.category_key);
                menuContainer.appendChild(catTitle);

                // Grid Container
                const grid = document.createElement('div');
                grid.className = 'menu-items-list'; // Use the CSS class we kept/will keep

                pageData.items.forEach(item => {
                    grid.innerHTML += createMenuItem(item);
                });
                menuContainer.appendChild(grid);
            }

            // Controls
            controlsDiv.innerHTML = `
                <button id="prev-page" class="page-btn" ${currentPage === 0 ? 'disabled' : ''}>&#8592; Previous</button>
                <span id="page-indicator" style="margin: 0 15px;font-family:'Playfair Display';font-weight:bold;">${currentPage + 1} / ${menuData.length}</span>
                <button id="next-page" class="page-btn" ${currentPage === menuData.length - 1 ? 'disabled' : ''}>Next &#8594;</button>
            `;
            menuContainer.appendChild(controlsDiv);

            // Re-attach listeners to new buttons
            document.getElementById('prev-page').addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    renderMenu();
                    document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
                }
            });
            document.getElementById('next-page').addEventListener('click', () => {
                if (currentPage < menuData.length - 1) {
                    currentPage++;
                    renderMenu();
                    document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
                }
            });

            // Trigger translations for new content
            if (typeof window.applyLanguage === 'function') {
                const currentLang = localStorage.getItem('selectedLang') || 'en';
                window.applyLanguage(currentLang);
            }

            // Re-bind Lightbox to new images
            if (typeof initGallery === 'function') {
                initGallery();
            }
        };

        // Initial Render
        renderMenu();
    }

    /* --- OLD STATIC LOGIC (Inactive - Removed) --- */
    return; // Stop execution here just in case
    /*
    const menuSections = document.querySelectorAll('.menu-section');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    if (menuSections.length > 0 && prevBtn && nextBtn) {
        let currentPage = 0;

        function updateMenuDisplay() {
            // Hide all sections
            menuSections.forEach((section, index) => {
                if (index === currentPage) {
                    section.style.display = 'block';
                    section.classList.add('active'); // Optional for CSS animations
                    section.style.animation = 'fadeIn 0.5s ease';
                } else {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });

            // Update Indicator
            if (pageIndicator) {
                // Get translated "Page" text if possible, else default
                const lang = localStorage.getItem('selectedLang') || 'en';
                const currentTranslations = translations[lang] || translations['en'];
                const indicatorTemplate = currentTranslations["menu.page_indicator"] || "Page %s of %s";

                // Simple string replacement
                pageIndicator.textContent = indicatorTemplate.replace('%s', currentPage + 1).replace('%s', menuSections.length);
            }

            // Update Buttons State
            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage === menuSections.length - 1;

            // Re-init lightbox or scroll to top of menu if needed
            // initGallery() is not needed if images are static, but good to keep if it does extra setup
            if (typeof initGallery === 'function') initGallery();
        }

        // Event Listeners
        prevBtn.addEventListener('click', () => {
            if (currentPage > 0) {
                currentPage--;
                updateMenuDisplay();
                document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentPage < menuSections.length - 1) {
                currentPage++;
                updateMenuDisplay();
                document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
            }
        });

        // Initialize
        updateMenuDisplay();

        // Hook into language switcher to update indicator text only (sections are already translated via data-i18n)
        const originalApplyLanguageFn = window.applyLanguage;
        window.applyLanguage = function (lang) {
            if (originalApplyLanguageFn) originalApplyLanguageFn(lang);
            updateMenuDisplay(); // Refresh indicator text
        };
    } else {
        // Fallback: If elements not found, ensure all sections are visible?
        // Or just do nothing (default HTML behavior is all visible)
    }
    */
}






/* =================================================
   8. DATE PICKER RESTRICTIONS
   ================================================= */
function initDatePickers() {
    const checkIn = document.getElementById('checkInDate');
    const checkOut = document.getElementById('checkOutDate');

    if (checkIn && checkOut) {
        // 1. Set minimum date to today (Using Local Time to avoid timezone issues)
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        checkIn.setAttribute('min', today);
        checkOut.setAttribute('min', today);

        // 2. Update Check-out minimum when Check-in changes
        checkIn.addEventListener('change', function () {
            validateDateInput(this, today);

            if (this.value) {
                checkOut.setAttribute('min', this.value);

                // If check-out is before new check-in, clear it
                if (checkOut.value && checkOut.value < this.value) {
                    checkOut.value = "";
                }
            }
        });

        checkOut.addEventListener('change', function () {
            // For checkout, min date is checkIn date OR today
            const minDate = checkIn.value || today;
            validateDateInput(this, minDate);
        });
    }
}

function validateDateInput(input, minDate) {
    if (input.value && input.value < minDate) {
        const lang = localStorage.getItem('selectedLang') || 'en';
        const messages = {
            en: "You cannot select a past date.",
            uz: "O'tib ketgan sanani tanlay olmaysiz.",
            ru: "Вы не можете выбрать прошедшую дату."
        };
        alert(messages[lang] || messages['en']);
        input.value = ""; // Clear invalid input
    }
}

/* =================================================
   9. FAQ ACCORDION LOGIC
   ================================================= */
function initFAQ() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
            // Toggle active class on header
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');

            // Find the answer content
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (isActive) {
                // Open
                content.style.maxHeight = content.scrollHeight + "px";
                if (icon) icon.style.transform = 'rotate(180deg)';
                this.style.color = '#00caa5';
            } else {
                // Close
                content.style.maxHeight = '0px';
                if (icon) icon.style.transform = 'rotate(0deg)';
                this.style.color = '#2c3e50'; // Reset color
            }
        });
    });
}

/* =================================================
   10. MAIN INITIALIZATION
   ================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 0. IMMEDIATE TRACKING (Priority)
    console.log("DOM Loaded: Initializing Tracking...");
    trackSiteStats();

    // 1. Other Initializers
    try { initBookingForm(); } catch (e) { console.error("Error in initBookingForm:", e); }
    try { initMobileMenu(); } catch (e) { console.error("Error in initMobileMenu:", e); }
    try { initCustomSelects(); } catch (e) { console.error("Error in initCustomSelects:", e); }
    try { initGallery(); } catch (e) { console.error("Error in initGallery:", e); }
    initLanguageSwitcher();
    try { initReviews(); } catch (e) { console.error("Error in initReviews:", e); }
    try { initScrollAndMenu(); } catch (e) { console.error("Error in initScrollAndMenu:", e); }
    try { initFAQ(); } catch (e) { console.error("Error in initFAQ:", e); }
    try { initDatePickers(); } catch (e) { console.error("Error in initDatePickers:", e); }
});
