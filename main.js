/* =================================================
   IMAGE PATH NORMALIZER & FALLBACK HANDLER
   ================================================= */
function fixImgPath(p) {
    if (!p || typeof p !== 'string') return p;
    p = p.trim();
    if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:') || p.startsWith('images/') || p.startsWith('/images/')) {
        return p;
    }
    return 'images/' + p;
}

// XSS Sanitizer: safely escape user-generated HTML content
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Auto-recover any image that fails to load if it was requested without 'images/' prefix
window.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') {
        const img = e.target;
        const currentSrc = img.getAttribute('src');
        if (currentSrc && !currentSrc.startsWith('images/') && !currentSrc.startsWith('http') && !currentSrc.startsWith('data:') && !img.dataset.retried) {
            img.dataset.retried = 'true';
            img.src = 'images/' + currentSrc.split('/').pop();
        }
    }
}, true);

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
        "footer.payment_accepted": "Accepted payment methods",
        "footer.payment_cash": "Cash",

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
        "reviews.cta_text": "Enjoyed your stay? We'd love to hear about your experience.<br>Your feedback helps fellow travelers discover Khiva.",
        "reviews.btn_google": "Leave a Review on Google",
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

        // MORE INFO BANNER
        "tours.more_info_title": "More Information",
        "tours.more_info_desc": "For more detailed information about our tour services, itineraries, and booking, please visit our dedicated travel website:",
        "tours.more_info_link": "Visit Meros Travel",

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
        "rooms.per_night": "night",

        // --- ADMIN-EDITABLE ROOM PRICES (list page) ---
        "rooms.price_double": "$50 / $35 (Single)",
        "rooms.price_twin": "$50 / $35 (Single)",
        "rooms.price_triple": "$80 / $60 (Double) / $40 (Single)",
        "rooms.price_twin_balcony": "$60 / $45 (Single)",
        "rooms.price_double_balcony": "$60 / $45 (Single)",


        // --- ADMIN-EDITABLE ROOM COVER IMAGES (data-i18n-src) ---
        "rooms.img_double": "images/doubleroom1.jpg",
        "rooms.img_twin": "images/twinroom1.jpg",
        "rooms.img_triple": "images/tripleroom1.jpg",
        "rooms.img_twin_balcony": "images/twinbalcony1.jpg",
        "rooms.img_double_balcony": "images/Dbalcony.jpg",


        // --- ADMIN-EDITABLE DAY TRIP PRICES ---
        "tour_day.price_3f_sedan": "$50", "tour_day.price_3f_suv": "$80", "tour_day.price_3f_minivan": "$105", "tour_day.price_3f_minibus": "$115",
        "tour_day.price_5f_sedan": "$65", "tour_day.price_5f_suv": "$90", "tour_day.price_5f_minivan": "$125", "tour_day.price_5f_minibus": "$145",
        "tour_day.price_7f_sedan": "$75", "tour_day.price_7f_suv": "$100", "tour_day.price_7f_minivan": "$140", "tour_day.price_7f_minibus": "$160",
        "tour_day.price_9f_sedan": "$90", "tour_day.price_9f_suv": "$120", "tour_day.price_9f_minivan": "$160", "tour_day.price_9f_minibus": "$185",
        "tour_day.price_badai_sedan": "$70", "tour_day.price_badai_suv": "$115", "tour_day.price_badai_minivan": "$150", "tour_day.price_badai_minibus": "$170",
        "tour_day.price_nukus_sedan": "$70", "tour_day.price_nukus_suv": "$110", "tour_day.price_nukus_minivan": "$150", "tour_day.price_nukus_minibus": "$170",
        "tour_day.price_nukus_miz_sedan": "$80", "tour_day.price_nukus_miz_suv": "$130", "tour_day.price_nukus_miz_minivan": "$170", "tour_day.price_nukus_miz_minibus": "$190",
        "tour_day.price_muynak_sedan": "$120", "tour_day.price_muynak_suv": "$190", "tour_day.price_muynak_minivan": "$255", "tour_day.price_muynak_minibus": "$275",
        "tour_day.price_nukus_fort_sedan": "$90", "tour_day.price_nukus_fort_suv": "$140", "tour_day.price_nukus_fort_minivan": "$175", "tour_day.price_nukus_fort_minibus": "$195",

        // --- ADMIN-EDITABLE TRANSFER PRICES ---
        "transfers.price_railway_sedan": "$5", "transfers.price_railway_suv": "$10", "transfers.price_railway_minivan": "$15", "transfers.price_railway_minibus": "$20",
        "transfers.price_urgench_sedan": "$15", "transfers.price_urgench_suv": "$25", "transfers.price_urgench_minivan": "$35", "transfers.price_urgench_minibus": "$50",
        "transfers.price_shavat_sedan": "$30", "transfers.price_shavat_suv": "$45", "transfers.price_shavat_minivan": "$60", "transfers.price_shavat_minibus": "$80",
        "transfers.price_nukus_sedan": "$60", "transfers.price_nukus_suv": "$90", "transfers.price_nukus_minivan": "$130", "transfers.price_nukus_minibus": "$150",
        "transfers.price_bukhara_sedan": "$80", "transfers.price_bukhara_suv": "$130", "transfers.price_bukhara_minivan": "$190", "transfers.price_bukhara_minibus": "$210",
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
        "menu.desc_tefteli": "Hearty traditional soup with tender seasoned meatballs, potato, and sweet carrot in clear aromatic broth.",
        "menu.special_soup": "Traditional Boiled Soup (Qaynatma)",
        "menu.desc_special_soup": "Rich and clear broth with tender meat and vegetables, cooked to perfection.",
        "menu.shashlik": "Shashlik Assortment",
        "menu.desc_shashlik": "Juicy grilled skewers: Beef, Lamb, or Chicken served with onions.",
        "menu.shashlik_qiyma": "Minced Meat Shashlik (Lula Kebab)",
        "menu.desc_shashlik_qiyma": "Tender ground beef and lamb skewers seasoned with aromatic spices, served with marinated onions and lavash.",
        "menu.shashlik_kuskovoy": "Beef Shashlik (Tender Chunks)",
        "menu.desc_shashlik_kuskovoy": "Charcoal-grilled tender chunks of marinated beef and lamb fat, served with fresh onions and tomato slices.",
        "menu.shashlik_tovuq": "Chicken Shashlik",
        "menu.desc_shashlik_tovuq": "Tender and juicy grilled chicken skewers seasoned with special spices, served with fresh tomato and onion salad.",
        "menu.galubsi": "Galubsi Soup (Stuffed Pepper)",
        "menu.desc_galubsi": "Traditional soup with sweet bell pepper stuffed with seasoned meat, served with tender beef and potato in clear broth.",
        "menu.mastava": "Mastava (Uzbek Rice & Beef Soup)",
        "menu.desc_mastava": "Traditional hearty soup with tender beef cubes, rice, sweet vegetables, and fresh herbs.",
        "menu.lentil_soup": "Lentil Cream Soup (Mercimek)",
        "menu.desc_lentil_soup": "Silky smooth, aromatic cream soup made from red lentils and fine spices, served with fresh lemon.",
        "menu.somsa": "Meat Somsa",
        "menu.desc_somsa": "Crispy oven-baked layered pastry filled with juicy seasoned beef and onions.",
        "menu.somsa_qovoq": "Pumpkin Somsa (Vegetarian)",
        "menu.desc_somsa_qovoq": "Traditional oven-baked flaky pastry filled with sweet spiced pumpkin and onions, served with tomato sauce.",
        "menu.achichuk": "Achchiq-Chuchuk (Tomato & Onion Salad)",
        "menu.desc_achichuk": "Traditional Uzbek salad of thinly sliced ripe tomatoes, crisp red onions, hot green peppers, and fragrant purple basil.",
        "menu.garden_salad": "Fresh Garden Salad",
        "menu.desc_garden_salad": "Crisp cucumbers, juicy sweet tomatoes, and fresh garden herbs tossed in light dressing.",
        "menu.caesar": "Caesar Salad",
        "menu.desc_caesar": "Crisp iceberg lettuce, tender chicken breast, juicy tomatoes, golden croutons, and grated cheese under creamy caesar dressing.",
        "menu.salad_beef": "Beef & Vegetable Salad",
        "menu.desc_salad_beef": "Tender pan-seared beef chunks tossed with colorful sweet bell peppers, fresh cucumbers, tomatoes, and aromatic fresh coriander.",
        "menu.salad_beetroot": "Beetroot & Walnut Salad",
        "menu.desc_salad_beetroot": "Rich salad of tender sweet beetroot, cheese, and herbs in creamy dressing, topped with roasted crushed walnuts.",
        "menu.salad_vitamin": "Vitamin Salad",
        "menu.desc_salad_vitamin": "Vibrant and crunchy medley of red cabbage, sweet corn, bell peppers, fresh cucumbers, and green herbs.",
        "menu.cabbage_salad": "Cabbage Salad",
        "menu.desc_cabbage_salad": "Crispy fresh white cabbage tossed with sweet carrots, cucumbers, ripe tomatoes, and fragrant garden herbs.",
        "menu.olivier_salad": "Olivier Salad",
        "menu.desc_olivier_salad": "Traditional festive salad of tender beef, diced boiled potatoes, carrots, eggs, pickled cucumbers, and green peas in rich mayonnaise.",
        "menu.shuba_salad": "Shuba Salad (Herring Under a Fur Coat)",
        "menu.desc_shuba_salad": "Famous festive layered salad of tender herring fillet beneath layers of grated potatoes, sweet carrots, eggs, and ruby beetroot with mayo.",
        "menu.eggplant": "Crispy Eggplant Rolls Salad",
        "menu.desc_eggplant": "Crispy pan-fried eggplant rolls filled with savory garlic and herb filling, served on fresh lettuce with sweet balsamic glaze.",
        "menu.rice": "Steamed Rice with Vegetables (Side Dish)",
        "menu.desc_rice": "Fluffy steamed rice garnished with sweet corn and green peas, served with sliced fresh tomato and herbs.",
        "menu.qapshirma": "Qapshirma",
        "menu.desc_qapshirma": "Fried layered dough, a delicious local side snack.",
        "menu.tea": "Artisan Teas & Fruit Infusions",
        "menu.desc_tea": "Traditional green and black teas, herbal blends, and hot fruit infusions with citrus and spices served in glass teapot.",
        "menu.coffee": "Espresso & Artisan Coffee",
        "menu.desc_coffee": "Rich, aromatic freshly brewed espresso, Americano, cappuccino, and latte made from premium roasted coffee beans.",
        "menu.juice": "Freshly Squeezed Juices",
        "menu.desc_juice": "100% natural freshly pressed juices: Orange, Apple, Carrot, Beetroot, and seasonal specials.",
        "menu.cold_drinks": "Cold Soft Drinks",
        "menu.desc_cold_drinks": "Chilled and refreshing soft drinks: Coca-Cola, Fanta, Sprite, and sparkling mineral water served ice-cold.",
        "menu.wine": "Red & White Wines",
        "menu.desc_wine": "Selection of premium Uzbek and international red and white wines, served by the bottle or glass.",
        "menu.cocktail": "Refreshing Cocktails & Mocktails",
        "menu.desc_cocktail": "Mojito, Gin Tonic, Tequila Sunrise, Moscow Mule, and other refreshing alcoholic and non-alcoholic mixes.",
        "menu.page_indicator": "Page of ",
        "menu.btn_prev": "Previous",
        "menu.btn_next": "Next",
        "menu.rooftop_badge": "Meros Rooftop Dining",

        // --- PAGE BANNERS & MAIN IMAGES ---
        // Defaults are handled by style.css. When an admin uploads an image,
        // it will be fetched from Firestore and applied dynamically.
        "page.img_home_hero": "images/gallery10.jpg",
        "page.img_about": "images/Things-to-do-in-Khiva-Travel-Guide.webp",
        "page.img_rooms_hero": "images/gallery2.jpg",
        "page.img_tours_hero": "images/khiva-city-tour-11.jpg",
        "page.img_day_hero": "images/private_day_hero.jpg",
        "page.img_transfer_hero": "images/private_transfer_hero.jpg",
        "page.img_restaurant_hero": "images/rooftop-dining.png",
        "page.img_gallery_hero": "images/galerry1.jpg",
        // --- RESTAURANT MENU IMAGES ---
        "menu.img_shivit": "images/shivit_oshi.jpg?v=3.3",
        "menu.img_tuxum_barak": "images/tuxum_barak.jpg?v=3.0",
        "menu.img_palov": "images/plov.jpg?v=3.4",
        "menu.img_manti": "images/manti.jpg?v=3.5",
        "menu.img_gumma": "images/gumma.jpg?v=3.6",
        "menu.img_qapshirma": "images/qapshirma.jpg?v=3.7",
        "menu.img_shashlik": "images/shashlik.jpg",
        "menu.img_shashlik_qiyma": "images/shashlik_qiyma.jpg?v=3.0",
        "menu.img_shashlik_kuskovoy": "images/shashlik_kuskovoy.jpg?v=3.0",
        "menu.img_shashlik_tovuq": "images/shashlik_tovuq.jpg?v=3.2",
        "menu.img_somsa": "images/somsa.jpg?v=3.9",
        "menu.img_somsa_qovoq": "images/somsa_qovoq.jpg?v=3.8",
        "menu.img_soup_barak": "images/soup_barak.jpg?v=3.1",
        "menu.img_tefteli": "images/tefteli.webp?v=4.9",
        "menu.img_special_soup": "images/special_soup.jpg?v=4.3",
        "menu.img_galubsi": "images/galubsi.jpg?v=4.1",
        "menu.img_mastava": "images/soup_mastava.jpg?v=4.5",
        "menu.img_lentil_soup": "images/soup_lentil.jpg?v=4.5",
        "menu.img_achichuk": "images/achichuk.webp?v=5.0",
        "menu.img_garden_salad": "images/garden_salad.webp?v=5.0",
        "menu.img_caesar": "images/caesar.jpg?v=5.0",
        "menu.img_salad_beef": "images/salad_beef.webp?v=5.0",
        "menu.img_salad_beetroot": "images/salad_beetroot.webp?v=5.0",
        "menu.img_salad_vitamin": "images/salad_vitamin.webp?v=5.0",
        "menu.img_eggplant": "images/eggplant_salad.jpg?v=4.1",
        "menu.img_rice": "images/boiled_rice.jpg?v=4.6",
        "menu.img_cabbage_salad": "images/salad_cabbage.jpg?v=5.0",
        "menu.img_olivier_salad": "images/salad_olivier.jpg?v=5.0",
        "menu.img_shuba_salad": "images/salad_shuba.jpg?v=5.0",
        "menu.img_tea": "images/tea.webp?v=5.4",
        "menu.img_coffee": "images/coffee.webp?v=5.6",
        "menu.img_juice": "images/fresh_juices.jpg?v=5.4",
        "menu.img_cold_drinks": "images/cold_drinks.jpg?v=5.5",
        "menu.img_wine": "images/wine.jpg?v=5.4",
        "menu.img_cocktail": "images/cocktails.jpg?v=5.4"
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
        "footer.payment_accepted": "To'lov usullari (qabul qilinadi)",
        "footer.payment_cash": "Naqd pul",

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
        "reviews.cta_text": "Mehmonxonamiz sizga yoqdimi? Taassurotlaringiz bilan o'rtoqlashing.<br>Fikringiz boshqa sayohatchilarga Xivani kashf qilishga yordam beradi.",
        "reviews.btn_google": "Google'da izoh qoldirish",
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

        // MORE INFO BANNER
        "tours.more_info_title": "Batafsil Ma'lumot",
        "tours.more_info_desc": "Tur xizmatlarimiz, yo'nalishlar va band qilish bo'yicha batafsilroq ma'lumot olish uchun maxsus saytimizga tashrif buyuring:",
        "tours.more_info_link": "Meros Travel'ga O'tish",

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
        "menu.cat_soups": "Sho'rvalar va Quyuq Taomlar",
        "menu.cat_salads": "Salatlar va Gazaklar",
        "menu.cat_drinks": "Ichimliklar va Shirinliklar",
        "menu.btn_prev": "Oldingi",
        "menu.btn_next": "Keyingi",
        "menu.rooftop_badge": "Meros Rooftop Restorani",

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
        "menu.desc_tefteli": "Yumshoq sersuv go'shtli teftellar, butun kartoshka va shirin sabzi bilan shaffof xushbo'y sho'rvada tortiladi.",
        "menu.special_soup": "Qaynatma Sho'rva",
        "menu.desc_special_soup": "Yumshoq go'sht va sabzavotlar bilan uzoq qaynatilgan mazali va to'yimli sho'rva.",
        "menu.shashlik": "Shashlik Assorti",
        "menu.desc_shashlik": "Sersuv kaboblar: Mol, Qo'y yoki Tovuq go'shti, piyoz bilan tortiladi.",
        "menu.shashlik_qiyma": "Qiyma Shashlik (Lyulya Kabob)",
        "menu.desc_shashlik_qiyma": "Xushbo'y ziravorlar bilan maydalangan mol va qo'y go'shtidan sersuv kabob, piyoz va yupqa lavash bilan.",
        "menu.shashlik_kuskovoy": "Kuskovoy Shashlik (Go'shtli Kabob)",
        "menu.desc_shashlik_kuskovoy": "Dumba yog'i va marinadlangan lahm mol go'shtidan ko'mirda pishirilgan sersuv shashlik, piyoz va pomidor bilan.",
        "menu.shashlik_tovuq": "Tovuq Shashlik",
        "menu.desc_shashlik_tovuq": "Xushbo'y ziravorlar bilan mayin marinadlangan va ko'mirda pishirilgan sersuv tovuq go'shti kabobi, piyoz va pomidor bilan.",
        "menu.galubsi": "Golubsi Sho'rva (Bulg'or Do'lma)",
        "menu.desc_galubsi": "Sersuv qiymali go'sht bilan to'ldirilgan bulg'or qalampiri, lahm go'sht va kartoshka bilan shaffof sho'rvada tortiladi.",
        "menu.mastava": "Mastava",
        "menu.desc_mastava": "Yumshoq mol go'shti, guruch, sabzavotlar va xushbo'y yangi ko'katlar bilan pishirilgan to'yimli milliy sho'rva.",
        "menu.lentil_soup": "Yasmiq Sho'rva (Chechevitsa)",
        "menu.desc_lentil_soup": "Qizil yasmiqdan tayyorlangan mayin va baxmal krem-sho'rva, yangi limon bo'lagi bilan tortiladi.",
        "menu.somsa": "Go'shtli Somsa",
        "menu.desc_somsa": "Duxovkada pishirilgan, sersuv mol go'shti va piyoz bilan to'ldirilgan qarsildoq qatlama somsa.",
        "menu.somsa_qovoq": "Qovoqli Somsa",
        "menu.desc_somsa_qovoq": "Shirin qovoq, piyoz va xushbo'y ziravorlar bilan to'ldirilgan qatlama xamirdan pishirilgan somsa, sous bilan.",

        "menu.achichuk": "Achchiq-Chuchuk",
        "menu.desc_achichuk": "Yupqa to'g'ralgan shirin pomidor, qizil piyoz, achchiq qalampir va xushbo'y rayhon barglari bilan tayyorlangan milliy salat.",
        "menu.garden_salad": "Mevsumiy Bog' Salati",
        "menu.desc_garden_salad": "Yangi qarsildoq bodring, sersuv pomidor va mayin oshko'katlar (ukrop) bilan tayyorlangan yengil tetiklantiruvchi salat.",
        "menu.caesar": "Sezar Salati",
        "menu.desc_caesar": "Qarsildoq aysberg karami, mayin tovuq filesi, pomidor, qovurilgan krutonlar, pishloq va maxsus qaymoqli sezar sousi.",
        "menu.salad_beef": "Go'shtli Sabzavotli Salat",
        "menu.desc_salad_beef": "Tovada qovurilgan mayin mol go'shti bo'laklari, rang-barang bulg'or qalampirlari, yangi bodring, pomidor va kashnich ko'kati bilan tayyorlangan to'yimli iliq salat.",
        "menu.salad_beetroot": "Lavlagi Salati (Yong'oqli)",
        "menu.desc_salad_beetroot": "Shirin pishirilgan qizil lavlagi, pishloq, mayin ko'katlar va mayonez, ustidan maydalangan xushbo'y yong'oq sepilgan bayramona salat.",
        "menu.salad_vitamin": "Vitamin Salati",
        "menu.desc_salad_vitamin": "Qizil va oq qarsildoq karam, shirin makkajo'xori, bulg'or qalampiri, bodring va ko'k piyoz bilan tayyorlangan vitaminlarga boy yorqin salat.",
        "menu.cabbage_salad": "Karam Salati",
        "menu.desc_cabbage_salad": "Yangi qarsildoq karam, shirin sabzi, bodring, yangi pomidor va xushbo'y oshko'katlar bilan tayyorlangan yengil salat.",
        "menu.olivier_salad": "Olivye Salati",
        "menu.desc_olivier_salad": "Mayda to'g'ralgan lahm mol go'shti, kartoshka, sabzi, tuxum, tuzlangan bodring va no'xat bilan mayonezli an'anaviy bayramona salat.",
        "menu.shuba_salad": "Shuba Salati",
        "menu.desc_shuba_salad": "Qatlamli mashhur bayramona salat: mayin seld balig'i filesi, kartoshka, sabzi, tuxum va mayonez bilan qoplangan shirin lavlagi.",
        "menu.eggplant": "Baqlajon Salati (Rulet)",
        "menu.desc_eggplant": "Qarsildoq qovurilgan baqlajon ruletlari, sarimsoq va ko'katlar bilan to'ldirilgan va maxsus shirin sous bilan bezatilgan yangi salat.",
        "menu.rice": "Qaynatilgan Guruch (Garnir)",
        "menu.desc_rice": "Makkajo'xori va yashil no'xat donachalari bilan pishirilgan mayin guruch, yangi pomidor va ko'katlar bilan.",
        "menu.qapshirma": "Qapshirma",
        "menu.desc_qapshirma": "Qovurilgan qatlama xamir, mahalliy sevimli gazak.",

        "menu.tea": "Choylar va Mevali Damlamalar",
        "menu.desc_tea": "An'anaviy ko'k va qora choy, limon, yalpiz va tabiiy mevali damlamalar shisha choynakda tortiladi.",
        "menu.coffee": "Espresso va Qahvalar (Kofe)",
        "menu.desc_coffee": "Yangi tuyilgan sifatli qahva donalaridan tayyorlangan xushbo'y va quyuq espresso, amerikano, kapuchino va latte.",
        "menu.juice": "Yangi Siqilgan Tabiiy Sharbatlar",
        "menu.desc_juice": "100% tabiiy meva va sabzavotlardan yangi siqilgan sharbatlar: Apelsin, Olma, Sabzi, Lavlagi va mavsumiy ne'matlar.",
        "menu.cold_drinks": "Salqin Ichimliklar (Kola, Fanta, Sprite)",
        "menu.desc_cold_drinks": "Muzdek tetiklantiruvchi gazli va gazsiz ichimliklar: Coca-Cola, Fanta, Sprite hamda mineral suvlar.",
        "menu.wine": "Qizil va Oq Vinolar (Sharob)",
        "menu.desc_wine": "O'zbekistonning mashhur 'Bagizagan' va boshqa saralangan qizil hamda oq vinolari, shisha yoki bokalda tortiladi.",
        "menu.cocktail": "Tetiklantiruvchi Kokteyllar",
        "menu.desc_cocktail": "Moxito, Jin Tonik, Tekila Sanrayz, Moskva Myul va boshqa xushbo'y tetiklantiruvchi kokteyllar.",
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
        "footer.payment_accepted": "Принимаемые способы оплаты",
        "footer.payment_cash": "Наличные",

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
        "reviews.cta_text": "Понравилось у нас? Будем рады, если поделитесь своими впечатлениями.<br>Ваш отзыв поможет другим путешественникам открыть для себя Хиву.",
        "reviews.btn_google": "Оставить отзыв в Google",
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

        // MORE INFO BANNER
        "tours.more_info_title": "Подробная Информация",
        "tours.more_info_desc": "Для получения более подробной информации о наших туристических услугах, маршрутах и бронировании, посетите наш специализированный сайт:",
        "tours.more_info_link": "Перейти на Meros Travel",

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
        "menu.btn_prev": "Назад",
        "menu.btn_next": "Вперед",
        "menu.rooftop_badge": "Meros Rooftop Ресторан",

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
        "menu.desc_tefteli": "Традиционный наваристый суп с нежными сочными тефтелями, цельным картофелем и сладкой морковью в прозрачном ароматном бульоне.",
        "menu.special_soup": "Кайнатма Шурва",
        "menu.desc_special_soup": "Традиционный наваристый суп с нежным мясом и овощами, приготовленный на медленном огне.",
        "menu.shashlik": "Ассорти Шашлыков",
        "menu.desc_shashlik": "Сочные шашлыки: Говядина, Баранина или Курица, подается с луком.",
        "menu.shashlik_qiyma": "Шашлык из Фарша (Люля-Кебаб)",
        "menu.desc_shashlik_qiyma": "Сочный шашлык из рубленой говядины и баранины с восточными специями, подается с луком и лавашом.",
        "menu.shashlik_kuskovoy": "Кусковой Шашлык (Из Говядины)",
        "menu.desc_shashlik_kuskovoy": "Сочные кусочки нежной маринованной говядины с курдюком, приготовленные на мангале, с луком и томатами.",
        "menu.shashlik_tovuq": "Куриный Шашлык",
        "menu.desc_shashlik_tovuq": "Нежные и сочные кусочки маринованной курочки, приготовленные на мангале, с томатами и свежим луком.",
        "menu.galubsi": "Суп Голубцы (Фаршированный перец)",
        "menu.desc_galubsi": "Традиционный наваристый суп со сладким перцем, фаршированным мясом, нежной говядиной и картофелем.",
        "menu.mastava": "Мастава",
        "menu.desc_mastava": "Традиционный наваристый узбекский суп с говядиной, рисом, овощами и ароматной зеленью.",
        "menu.lentil_soup": "Чечевичный Крем-Суп",
        "menu.desc_lentil_soup": "Нежный бархатистый крем-суп из красной чечевицы с восточными специями, подается с лимоном.",
        "menu.somsa": "Мясная Самса",
        "menu.desc_somsa": "Запеченная в духовке хрустящая слоеная самса с сочной говядиной и луком.",
        "menu.somsa_qovoq": "Самса с Тыквой (Вегетарианская)",
        "menu.desc_somsa_qovoq": "Хрустящая слоеная самса со сладкой тыквой, луком и восточными специями, подается с томатным соусом.",

        "menu.achichuk": "Аччик-Чучук (Салат из помидоров)",
        "menu.desc_achichuk": "Традиционный узбекский салат из тонко нарезанных спелых томатов, сладкого красного лука, острого перца и ароматного фиолетового базилика.",
        "menu.garden_salad": "Свежий Сезонный Салат",
        "menu.desc_garden_salad": "Освежающий салат из хрустящих огурцов, сочных томатов и свежего укропа.",
        "menu.caesar": "Салат Цезарь",
        "menu.desc_caesar": "Хрустящий салат айсберг, нежное куриное филе, томаты, золотистые крутоны, тертый сыр и яйцо под фирменным сливочным соусом.",
        "menu.salad_beef": "Мясной Салат с Овощами",
        "menu.desc_salad_beef": "Теплый салат с кусочками обжаренной сочной говядины, разноцветным сладким перцем, свежими огурцами, томатами и кинзой.",
        "menu.salad_beetroot": "Свекольный Салат с Орехами",
        "menu.desc_salad_beetroot": "Нежный салат из отварной сладкой свеклы, сыра и домашнего соуса, посыпанный хрустящими грецкими орехами.",
        "menu.salad_vitamin": "Витаминный Салат",
        "menu.desc_salad_vitamin": "Яркий хрустящий салат из красной капусты, сладкой кукурузы, болгарского перца, огурцов и свежей зелени.",
        "menu.cabbage_salad": "Салат из Капусты",
        "menu.desc_cabbage_salad": "Свежий и хрустящий салат из белокочанной капусты, сладкой моркови, сочных огурцов, томатов и свежей зелени.",
        "menu.olivier_salad": "Салат Оливье",
        "menu.desc_olivier_salad": "Классический праздничный салат с отварной говядиной, картофелем, сочной морковью, яйцами, солеными огурчиками и зеленым горошком под майонезом.",
        "menu.shuba_salad": "Сельдь под Шубой",
        "menu.desc_shuba_salad": "Знаменитый слоеный салат из нежного филе сельди, отварного картофеля, моркови, яиц и сладкой свеклы под нежным майонезом.",
        "menu.eggplant": "Салат из Баклажанов (Рулетики)",
        "menu.desc_eggplant": "Хрустящие обжаренные рулетики из баклажанов с чесночно-зеленой начинкой, под кисло-сладким соусом на свежих листьях салата.",
        "menu.rice": "Отварной Рис с Овощами (Гарнир)",
        "menu.desc_rice": "Рассыпчатый отварной рис со сладкой кукурузой и зеленым горошком, подается со свежим томатом и зеленью.",
        "menu.qapshirma": "Капширма",
        "menu.desc_qapshirma": "Жареное слоеное тесто, вкусная местная закуска.",

        "menu.tea": "Чай и Фруктовые Настои",
        "menu.desc_tea": "Традиционный зеленый и черный чай, травяные сборы и согревающие фруктовые настои с цитрусами в стеклянном чайнике.",
        "menu.coffee": "Эспрессо и Свежесваренный Кофе",
        "menu.desc_coffee": "Ароматный и насыщенный эспрессо, американо, капучино и латте, сваренные из отборных зерен свежей обжарки.",
        "menu.juice": "Свежевыжатые Соки (Фреш)",
        "menu.desc_juice": "100% натуральные свежевыжатые соки: Апельсиновый, Яблочный, Морковный, Свекольный и сезонные фрукты.",
        "menu.cold_drinks": "Прохладительные Напитки (Кола, Фанта, Спрайт)",
        "menu.desc_cold_drinks": "Охлажденные освежающие напитки: Coca-Cola, Fanta, Sprite и минеральная вода со льдом.",
        "menu.wine": "Красные и Белые Вина",
        "menu.desc_wine": "Коллекция лучших узбекских вин 'Багизаган' и зарубежных сортов, подается в бокалах или бутылках.",
        "menu.cocktail": "Освежающие Коктейли",
        "menu.desc_cocktail": "Мохито, Джин-тоник, Текила Санрайз, Московский мул и другие освежающие алкогольные и безалкогольные миксы.",
        "menu.page_indicator": "Страница %s из %s",
    },
};

/* =================================================
   5. LANGUAGE SWITCHER LOGIC
   ================================================= */
function initLanguageSwitcher() {
    const langToggleBtn = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');

    // Check saved language or default 'en' — no longer reloads for English
    let currentLang = localStorage.getItem('selectedLang') || 'en';
    applyLanguage(currentLang);

    if (langToggleBtn && langDropdown) {
        langToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!langToggleBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('show');
            }
        });

        langDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentLang = link.getAttribute('data-lang');
                localStorage.setItem('selectedLang', currentLang);
                applyLanguage(currentLang);
                langDropdown.classList.remove('show');
            });
        });
    }
}

function applyLanguage(lang) {
    const t = translations[lang] || translations['en'];

    // 1. Text elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        let val = t[key];
        let enVal = (translations['en'] && translations['en'][key]);

        // Clean legacy "+ boiled rice" from eggplant salad
        if (key === 'menu.eggplant') {
            if (typeof val === 'string') val = val.replace(/\s*\+\s*boiled rice/gi, '').replace(/\s*\+\s*qaynatilgan guruch/gi, '').replace(/\s*\+\s*вареный рис/gi, '').trim();
            if (typeof enVal === 'string') enVal = enVal.replace(/\s*\+\s*boiled rice/gi, '').replace(/\s*\+\s*qaynatilgan guruch/gi, '').replace(/\s*\+\s*вареный рис/gi, '').trim();
        }

        // Clean legacy "Wines & Beers" from wine card
        if (key === 'menu.wine') {
            if (typeof val === 'string' && (val.includes('& Beer') || val.includes('va Pivo') || val.includes('и Пиво'))) {
                val = (lang === 'uz') ? "Qizil va Oq Vinolar (Sharob)" : (lang === 'ru') ? "Красные и Белые Вина" : "Red & White Wines";
            }
            if (typeof enVal === 'string' && enVal.includes('& Beer')) {
                enVal = "Red & White Wines";
            }
        }
        if (key === 'menu.desc_wine') {
            if (typeof val === 'string' && (val.includes('imported beverages') || val.includes('import ichimliklar') || val.includes('импортных напитков'))) {
                val = (lang === 'uz') ? "O'zbekistonning mashhur 'Bagizagan' va boshqa saralangan qizil hamda oq vinolari, shisha yoki bokalda tortiladi." : (lang === 'ru') ? "Коллекция лучших узбекских вин 'Багизаган' и зарубежных сортов, подается в бокалах или бутылках." : "Selection of premium Uzbek and international red and white wines, served by the bottle or glass.";
            }
            if (typeof enVal === 'string' && enVal.includes('imported beverages')) {
                enVal = "Selection of premium Uzbek and international red and white wines, served by the bottle or glass.";
            }
        }

        if (val !== undefined && val !== null && String(val).trim() !== '') {
            el.innerHTML = val;
            el.removeAttribute('data-i18n-pending');
        } else if (enVal !== undefined && enVal !== null && String(enVal).trim() !== '') {
            el.innerHTML = enVal;
            el.removeAttribute('data-i18n-pending');
        }
    });

    // 2. Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        const val = t[key] || (translations['en'] && translations['en'][key]);
        if (val) el.setAttribute('placeholder', val);
    });

    // 3. Select Options
    document.querySelectorAll('option[data-i18n-opt]').forEach(el => {
        const key = el.getAttribute('data-i18n-opt');
        const val = t[key] || (translations['en'] && translations['en'][key]);
        if (val) el.innerText = val;
    });

    // 4. Image sources (data-i18n-src) — language-neutral, use 'en' key
    document.querySelectorAll('[data-i18n-src]').forEach(el => {
        const key = el.getAttribute('data-i18n-src');
        let src = (translations['en'] && translations['en'][key]);
        if (key === 'menu.img_wine' && src && (src.includes('images (1).jpg') || src.includes('images%20(1).jpg'))) {
            src = 'images/wine.jpg?v=5.2';
        }
        if (key === 'menu.img_juice' && src && src.includes('Featured_Image_1_1.webp')) {
            src = 'images/fresh_juices.jpg?v=5.3';
        }
        if (key === 'menu.img_cocktail' && src && (src.includes('images.jpg') || src === 'images/images.jpg')) {
            src = 'images/cocktails.jpg?v=5.4';
        }
        if (key === 'menu.img_tea' && src && src.includes('Cups_of_green_and_black_tea')) {
            src = 'images/tea.webp?v=5.4';
        }
        if (key === 'menu.img_coffee' && (!src || src.trim() === '')) {
            src = 'images/coffee.webp?v=5.6';
        }
        if (key === 'menu.img_cold_drinks' && (!src || src.trim() === '')) {
            src = 'images/cold_drinks.jpg?v=5.5';
        }
        if (src) {
            src = fixImgPath(src);
            el.src = src;
        } else if (el.getAttribute('src')) {
            el.src = fixImgPath(el.getAttribute('src'));
        }
        el.removeAttribute('data-i18n-pending');
    });

    // 5. Background Images (data-i18n-bg) — language-neutral, use 'en' key
    document.querySelectorAll('[data-i18n-bg]').forEach(el => {
        const key = el.getAttribute('data-i18n-bg');
        let src = (translations['en'] && translations['en'][key]);
        if (src) {
            src = fixImgPath(src);
            el.style.backgroundImage = `url('${src}')`;
        }
        el.removeAttribute('data-i18n-pending');
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
let db = null;
let storage = null;
let auth = null;

if (typeof firebase !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        console.log("Firebase Initialized");
        db = firebase.firestore();
        if (typeof firebase.storage !== 'undefined') storage = firebase.storage();
        if (typeof firebase.auth !== 'undefined') auth = firebase.auth();
    } catch (e) {
        console.error("Firebase Init Error:", e);
    }
} else {
    console.log("Firebase SDK not found on this page. Skipping DB init.");
}

/* =================================================
   FIRESTORE CONTENT OVERRIDES — loaded on every page
   ================================================= */
(function loadContentOverrides() {
    if (!db) return;

    // Mark all i18n elements as pending (skeleton state)
    document.querySelectorAll('[data-i18n],[data-i18n-src]').forEach(el => {
        el.setAttribute('data-i18n-pending', '1');
    });

    const TIMEOUT_MS = 4000;
    let resolved = false;

    // Fallback: if Firestore takes too long, apply local defaults
    const fallbackTimer = setTimeout(() => {
        if (!resolved) {
            resolved = true;
            const lang = localStorage.getItem('selectedLang') || 'en';
            applyLanguage(lang);
            console.warn('[Content] Firestore timeout — using local defaults.');
        }
    }, TIMEOUT_MS);

    db.collection('settings').doc('custom_translations').get().then(docSnap => {
        clearTimeout(fallbackTimer);
        if (!resolved) {
            resolved = true;
            if (docSnap.exists) {
                const overrides = docSnap.data();
                // Merge overrides into every language in translations (ignoring empty/whitespace strings so defaults aren't wiped)
                ['en', 'uz', 'ru'].forEach(lang => {
                    if (!translations[lang]) translations[lang] = {};
                    Object.keys(overrides).forEach(key => {
                        const val = overrides[key];
                        // Value may be a direct string (image/price) or an object {en, uz, ru}
                        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
                            if (val[lang] !== undefined && val[lang] !== null && String(val[lang]).trim() !== '') {
                                let cleanVal = val[lang];
                                if (key === 'menu.eggplant' && typeof cleanVal === 'string') {
                                    cleanVal = cleanVal
                                        .replace(/\s*\+\s*boiled rice/gi, '')
                                        .replace(/\s*\+\s*qaynatilgan guruch/gi, '')
                                        .replace(/\s*\+\s*вареный рис/gi, '')
                                        .trim();
                                    if (cleanVal === 'Eggplant Salad' || !cleanVal) cleanVal = 'Crispy Eggplant Rolls Salad';
                                    if (cleanVal === 'Baqlajonli Salat' || cleanVal === 'Baqlajon salati') cleanVal = 'Baqlajon Salati (Rulet)';
                                    if (cleanVal === 'Салат из Баклажанов') cleanVal = 'Салат из Баклажанов (Рулетики)';
                                }
                                if (key === 'menu.wine' && typeof cleanVal === 'string' && (cleanVal.includes('Beer') || cleanVal.includes('Pivo') || cleanVal.includes('Пиво'))) {
                                    return;
                                }
                                if (key === 'menu.desc_wine' && typeof cleanVal === 'string' && (cleanVal.includes('imported beverages') || cleanVal.includes('import ichimliklar') || cleanVal.includes('импортных напитков'))) {
                                    return;
                                }
                                translations[lang][key] = cleanVal;
                            }
                        } else {
                            // language-neutral key (e.g. image src)
                            let finalVal = val;
                            if (typeof finalVal === 'string' && finalVal.trim() !== '') {
                                if (key === 'menu.img_tefteli' && (finalVal.includes('tefteli.jpg') || finalVal.includes('v=4.2'))) {
                                    finalVal = 'images/tefteli.webp?v=4.9';
                                }
                                if (key === 'menu.img_achichuk' && finalVal.includes('achichuk.jpg')) {
                                    finalVal = 'images/achichuk.webp?v=5.0';
                                }
                                if (key === 'menu.img_garden_salad' && finalVal.includes('garden_salad.jpg')) {
                                    finalVal = 'images/garden_salad.webp?v=5.0';
                                }
                                if (key === 'menu.img_wine' && (finalVal.includes('images (1).jpg') || finalVal.includes('images%20(1).jpg'))) {
                                    finalVal = 'images/wine.jpg?v=5.2';
                                }
                                if (key === 'menu.img_juice' && finalVal.includes('Featured_Image_1_1.webp')) {
                                    finalVal = 'images/fresh_juices.jpg?v=5.3';
                                }
                                if (key === 'menu.img_cocktail' && (finalVal.includes('images.jpg') || finalVal === 'images/images.jpg')) {
                                    finalVal = 'images/cocktails.jpg?v=5.4';
                                }
                                if (key === 'menu.img_tea' && finalVal.includes('Cups_of_green_and_black_tea')) {
                                    finalVal = 'images/tea.webp?v=5.4';
                                }
                                if (key === 'menu.img_coffee' && (!finalVal || finalVal.trim() === '')) {
                                    finalVal = 'images/coffee.webp?v=5.6';
                                }
                                if (key === 'menu.img_cold_drinks' && (!finalVal || finalVal.trim() === '')) {
                                    finalVal = 'images/cold_drinks.jpg?v=5.5';
                                }
                                if (key.includes('img') || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(finalVal)) {
                                    finalVal = fixImgPath(finalVal);
                                }
                                translations['en'][key] = finalVal;
                            }
                        }
                    });
                });
                console.log('[Content] Firestore overrides applied:', Object.keys(overrides).length, 'keys');
            } else {
                console.log('[Content] No custom_translations doc found — using defaults.');
            }
            const lang = localStorage.getItem('selectedLang') || 'en';
            applyLanguage(lang);
        }
    }).catch(err => {
        clearTimeout(fallbackTimer);
        if (!resolved) {
            resolved = true;
            console.error('[Content] Firestore fetch failed — using local defaults.', err);
            const lang = localStorage.getItem('selectedLang') || 'en';
            applyLanguage(lang);
        }
    });
})();

/* =================================================
   ADMIN CONTENT EDITOR FUNCTIONS
   ================================================= */

/**
 * Load current translation values into the visual editor form fields.
 * Merges default translations with any Firestore overrides already in memory.
 */
async function loadAdminContentEditor() {
    if (!db) return;
    const docSnap = await db.collection('settings').doc('custom_translations').get().catch(() => null);
    const overrides = docSnap && docSnap.exists ? docSnap.data() : {};

    // Build effective values: default + overrides
    const effective = {};
    ['en', 'uz', 'ru'].forEach(lang => {
        effective[lang] = Object.assign({}, translations[lang] || {});
    });
    Object.keys(overrides).forEach(key => {
        const val = overrides[key];
        if (typeof val === 'object' && val !== null) {
            ['en', 'uz', 'ru'].forEach(lang => {
                if (val[lang] !== undefined && val[lang] !== null && String(val[lang]).trim() !== '') {
                    let cleanVal = val[lang];
                    if (key === 'menu.eggplant' && typeof cleanVal === 'string') {
                        cleanVal = cleanVal.replace(/\s*\+\s*boiled rice/gi, '').replace(/\s*\+\s*qaynatilgan guruch/gi, '').replace(/\s*\+\s*вареный рис/gi, '').trim();
                    }
                    effective[lang][key] = cleanVal;
                }
            });
        } else {
            let finalVal = val;
            if (typeof finalVal === 'string' && (key.includes('img') || /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(finalVal))) {
                finalVal = fixImgPath(finalVal);
            }
            effective['en'][key] = finalVal;
        }
    });

    // Populate form fields that have data-edit-key attribute
    document.querySelectorAll('[data-edit-key]').forEach(input => {
        const key = input.getAttribute('data-edit-key');
        const lang = input.getAttribute('data-edit-lang') || 'en';
        if (effective[lang] && effective[lang][key] !== undefined) {
            input.value = effective[lang][key];
        }
    });

    // Show "last saved" timestamp if available
    if (overrides._savedAt) {
        const el = document.getElementById('content-last-saved');
        if (el) {
            const d = overrides._savedAt.toDate ? overrides._savedAt.toDate() : new Date(overrides._savedAt);
            el.textContent = 'Last saved: ' + d.toLocaleString() + (overrides._savedBy ? ' by ' + overrides._savedBy : '');
        }
    }
}

/**
 * Save only the changed fields for the given category tab to Firestore.
 * Also creates a backup before writing.
 * @param {string} category - e.g. 'rooms', 'tours', 'homepage', 'dining'
 */
async function saveAdminContentOverrides(category) {
    if (!db) { alert('Firebase not connected.'); return; }

    const saveBtn = document.getElementById('content-save-btn');
    const statusEl = document.getElementById('content-save-status');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }
    if (statusEl) statusEl.textContent = '';

    try {
        const docRef = db.collection('settings').doc('custom_translations');

        // 1. Back up current document before writing
        const current = await docRef.get().catch(() => null);
        if (current && current.exists) {
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            await db.collection('settings').doc('custom_translations_history').collection('backups').doc(ts)
                .set(current.data()).catch(e => console.warn('Backup failed (non-fatal):', e));
        }

        // 2. Collect only the fields changed in the current category
        const updates = {};
        document.querySelectorAll(`[data-edit-key][data-edit-category="${category}"]`).forEach(input => {
            const key = input.getAttribute('data-edit-key');
            const lang = input.getAttribute('data-edit-lang') || null;
            const val = input.value.trim();

            if (lang) {
                // Multi-lang field: store as nested object {en: ..., uz: ..., ru: ...}
                if (!updates[key]) updates[key] = {};
                updates[key][lang] = val;
            } else {
                // Language-neutral field (image src)
                updates[key] = val;
            }
        });

        // 3. Add audit metadata
        const adminUser = auth && auth.currentUser ? auth.currentUser.email : 'admin';
        updates._savedAt = firebase.firestore.FieldValue.serverTimestamp();
        updates._savedBy = adminUser;

        // 4. Partial update — only writes the touched fields
        await docRef.set(updates, { merge: true });

        // 5. Merge changes into live translations so page reflects instantly
        Object.keys(updates).forEach(key => {
            const val = updates[key];
            if (typeof val === 'object' && val !== null && !val.toDate) {
                ['en', 'uz', 'ru'].forEach(lang => {
                    if (val[lang] !== undefined && val[lang] !== null && String(val[lang]).trim() !== '') {
                        if (!translations[lang]) translations[lang] = {};
                        translations[lang][key] = val[lang];
                    }
                });
            } else if (typeof val === 'string') {
                translations['en'][key] = val;
            }
        });
        const activeLang = localStorage.getItem('selectedLang') || 'en';
        applyLanguage(activeLang);

        if (statusEl) statusEl.textContent = '✅ Saved successfully!';
        if (statusEl) statusEl.style.color = '#27ae60';
    } catch (err) {
        console.error('[Admin] Save failed:', err);
        if (statusEl) statusEl.textContent = '❌ Save failed: ' + err.message;
        if (statusEl) statusEl.style.color = '#e74c3c';
    } finally {
        if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Changes'; }
    }
}

/**
 * Upload an image file to Firebase Storage and update the corresponding input field.
 * Validates type/size, compresses via canvas, deletes old file if any.
 * @param {File} file - selected File object
 * @param {string} inputId - id of the <input> whose value should be updated with the new URL
 * @param {string} storageKey - the translation key used to look up any existing stored path
 */
async function uploadAdminImage(file, inputId, storageKey) {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_BYTES = 2 * 1024 * 1024; // 2MB

    const statusEl = document.getElementById('img-upload-status-' + inputId);
    const setStatus = (msg, color) => { if (statusEl) { statusEl.textContent = msg; statusEl.style.color = color || '#333'; } };

    if (!storage) { setStatus('Firebase Storage not available.', '#e74c3c'); return; }
    if (!ALLOWED_TYPES.includes(file.type)) { setStatus('❌ Invalid file type. Use JPG, PNG, or WebP.', '#e74c3c'); return; }
    if (file.size > MAX_BYTES) { setStatus('❌ File too large (max 2MB). Please compress first.', '#e74c3c'); return; }

    setStatus('⏳ Uploading…', '#e67e22');

    try {
        // Client-side compress via canvas
        const compressedBlob = await compressImage(file, 1200, 0.85);
        const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
        const filename = `site_images/${storageKey.replace(/\./g, '_')}_${Date.now()}.${ext}`;
        const ref = storage.ref().child(filename);

        // Delete old file if one exists for this key
        const oldInputEl = document.getElementById(inputId);
        const oldPath = oldInputEl && oldInputEl.getAttribute('data-storage-path');
        if (oldPath) {
            storage.ref().child(oldPath).delete().catch(() => { }); // non-fatal
        }

        // Upload new file
        await ref.put(compressedBlob);
        const downloadURL = await ref.getDownloadURL();

        // Update input
        const input = document.getElementById(inputId);
        if (input) {
            input.value = downloadURL;
            input.setAttribute('data-storage-path', filename);
        }
        setStatus('✅ Uploaded!', '#27ae60');
    } catch (err) {
        console.error('[Admin] Image upload failed:', err);
        setStatus('❌ Upload failed: ' + err.message, '#e74c3c');
    }
}

/** Compress image to max width via canvas */
function compressImage(file, maxWidth, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            const scale = Math.min(1, maxWidth / img.width);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
                file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
        };
        img.onerror = reject;
        img.src = url;
    });
}

/** Restore the most recent backup for settings/custom_translations */
async function restoreLastBackup() {
    if (!db) return;
    if (!confirm('Restore from the most recent backup? This will overwrite current settings.')) return;
    try {
        const backups = await db.collection('settings').doc('custom_translations_history')
            .collection('backups').orderBy(firebase.firestore.FieldPath.documentId(), 'desc').limit(1).get();
        if (backups.empty) { alert('No backup found.'); return; }
        const backupData = backups.docs[0].data();
        await db.collection('settings').doc('custom_translations').set(backupData);
        alert('Restored from backup: ' + backups.docs[0].id);
        loadAdminContentEditor();
    } catch (err) {
        alert('Restore failed: ' + err.message);
    }
}


/* =================================================
   6. REVIEW SYSTEM LOGIC (CONNECTED TO FIREBASE)
   ================================================= */
function initReviews() {
    // If db is not initialized, we can't do reviews
    if (!db) return;

    // Load reviews on initial load
    loadReviews();

    // Setup Carousel Navigation
    const track = document.getElementById('dynamic-reviews-container');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (track && prevBtn && nextBtn) {
        const scrollAmount = 370; // Approximated card width + gap

        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
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
                const safeName = escapeHtml(review.name || 'Guest');
                const safeDate = escapeHtml(review.date || '');
                const safeText = escapeHtml(review.text || '');
                const rating = Math.min(Math.max(parseInt(review.rating, 10) || 5, 1), 5);
                const starsHtml = '<i class="fas fa-star"></i>'.repeat(rating) + '<i class="far fa-star"></i>'.repeat(5 - rating);
                const userAvatar = review.avatar ? escapeHtml(review.avatar) : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'User')}&background=random&color=fff&rounded=true&size=128`;

                const uploadedImage = review.image
                    ? `<div class="review-image-container">
                         <img src="${escapeHtml(review.image)}" alt="Review Photo">
                       </div>`
                    : '';

                const card = document.createElement('div');
                card.className = 'google-review-card';
                card.innerHTML = `
                <div>
                    <div class="review-card-header">
                        <img src="${userAvatar}" alt="${safeName}" class="review-avatar">
                        <div class="review-author-info">
                            <h4 class="review-author-name">${safeName}</h4>
                            <p class="review-date">${safeDate}</p>
                        </div>
                    </div>
                    <div class="review-stars">${starsHtml}</div>
                    ${uploadedImage}
                    <p class="review-text">"${safeText}"</p>
                </div>
                <div class="google-attr">
                    <svg viewBox="0 0 48 48" width="16" height="16">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    <span>Posted on Google</span>
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

function showTab(tabName) {
    const pendingTab = document.getElementById('pending-reviews-tab');
    const approvedTab = document.getElementById('approved-reviews-tab');
    if (pendingTab) pendingTab.style.display = tabName === 'pending' ? 'block' : 'none';
    if (approvedTab) approvedTab.style.display = tabName === 'approved' ? 'block' : 'none';
}

function loadAdminReviews() {
    if (!db) return;
    const pendingList = document.getElementById('pending-reviews-list');
    const approvedList = document.getElementById('approved-reviews-list');
    const pendingBtn = document.getElementById('btn-pending');
    const approvedBtn = document.getElementById('btn-approved');

    const renderThumb = (img) => img ? `<img src="${escapeHtml(img)}" style="width:50px; height:50px; object-fit:cover; border-radius:4px; margin-right:10px; border:1px solid #eee;">` : '';

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
                                        <strong>${escapeHtml(r.name || "Anonymous")} <span style="font-weight:normal; font-size:12px; color:#777;">(${escapeHtml(r.date || "")})</span></strong>
                                        <br><span style="color:#f1c40f;">${'в…'.repeat(r.rating)}</span>
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 10px 0;">"${escapeHtml(r.text || "")}"</p>
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
                                        <strong>${escapeHtml(r.name || "Anonymous")} <span style="font-weight:normal; font-size:12px; color:#777;">(${escapeHtml(r.date || "")})</span></strong>
                                        <br><span style="color:#f1c40f;">${'в…'.repeat(r.rating)}</span>
                                    </div>
                                </div>
                            </div>
                            <p style="margin: 10px 0;">"${escapeHtml(r.text || "")}"</p>
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

const initializePickers = () => {
    const commonConfig = {
        minDate: "today",
        altInput: true,
        altFormat: "Y-m-d",
        dateFormat: "Y-m-d",
        allowInput: true,
        disableMobile: true,
        placeholder: placeholderTexts[lang] || "YYYY-MM-DD",
        altInputClass: "flatpickr-input-custom",
        onReady: function (selectedDates, dateStr, instance) {
            maskDateInput(instance.altInput || instance.input);
            // Explicitly set placeholder on altInput if it exists
            if (instance.altInput) {
                instance.altInput.placeholder = placeholderTexts[lang] || "YYYY-MM-DD";
                // Clear placeholder on focus for better UX
                instance.altInput.addEventListener('focus', function () {
                    this.placeholder = '';
                });
                // Restore placeholder on blur
                instance.altInput.addEventListener('blur', function () {
                    this.placeholder = placeholderTexts[lang] || "YYYY-MM-DD";
                });
            }
        }
    };

    const checkOutPicker = flatpickr(checkOut, {
        ...commonConfig
    });

    const checkInPicker = flatpickr(checkIn, {
        ...commonConfig,
        onChange: function (selectedDates, dateStr, instance) {
            checkOutPicker.set('minDate', dateStr || "today");
            if (checkOut.value && checkOut.value < dateStr) {
                checkOutPicker.clear();
            }
        }
    });
};

/* =================================================
   7. SCROLL TOP & DYNAMIC MENU LOGIC
   ================================================= */

// MENU DATA STRUCTURE
const menuData = [
    // PAGE 1
    {
        category_key: "menu.cat_national",
        icon: "fa-utensils",
        items: [
            { img_key: "menu.img_shivit", title_key: "menu.shivit", desc_key: "menu.desc_shivit", price_key: "dining.shivit_price", img_position: "center center" },
            { img_key: "menu.img_tuxum_barak", title_key: "menu.tuxum_barak", desc_key: "menu.desc_tuxum_barak", img_position: "center 62%" },
            { img_key: "menu.img_palov", title_key: "menu.palov", desc_key: "menu.desc_palov", price_key: "dining.plov_price", img_position: "center center" },
            { img_key: "menu.img_manti", title_key: "menu.manti", desc_key: "menu.desc_manti", img_position: "center center" },
            { img_key: "menu.img_gumma", title_key: "menu.gumma", desc_key: "menu.desc_gumma", img_position: "center center" },
            { img_key: "menu.img_qapshirma", title_key: "menu.qapshirma", desc_key: "menu.desc_qapshirma", img_position: "center center" },
            { img_key: "menu.img_shashlik_qiyma", title_key: "menu.shashlik_qiyma", desc_key: "menu.desc_shashlik_qiyma", img_position: "center 52%" },
            { img_key: "menu.img_shashlik_kuskovoy", title_key: "menu.shashlik_kuskovoy", desc_key: "menu.desc_shashlik_kuskovoy", img_position: "center 60%" },
            { img_key: "menu.img_shashlik_tovuq", title_key: "menu.shashlik_tovuq", desc_key: "menu.desc_shashlik_tovuq", img_position: "center center" },
            { img_key: "menu.img_somsa", title_key: "menu.somsa", desc_key: "menu.desc_somsa", img_position: "center center" },
            { img_key: "menu.img_somsa_qovoq", title_key: "menu.somsa_qovoq", desc_key: "menu.desc_somsa_qovoq", img_position: "center center" }
        ]
    },
    // PAGE 2
    {
        category_key: "menu.cat_soups",
        icon: "fa-bowl-rice",
        items: [
            { img_key: "menu.img_soup_barak", title_key: "menu.soup_barak", desc_key: "menu.desc_soup_barak", img_position: "center 55%" },
            { img_key: "menu.img_tefteli", title_key: "menu.tefteli", desc_key: "menu.desc_tefteli", img_position: "center 52%" },
            { img_key: "menu.img_special_soup", title_key: "menu.special_soup", desc_key: "menu.desc_special_soup", img_position: "center center" },
            { img_key: "menu.img_galubsi", title_key: "menu.galubsi", desc_key: "menu.desc_galubsi", img_position: "center center" },
            { img_key: "menu.img_mastava", title_key: "menu.mastava", desc_key: "menu.desc_mastava", img_position: "center center" },
            { img_key: "menu.img_lentil_soup", title_key: "menu.lentil_soup", desc_key: "menu.desc_lentil_soup", img_position: "center 60%" }
        ]
    },
    // PAGE 3
    {
        category_key: "menu.cat_salads",
        icon: "fa-leaf",
        items: [
            { img_key: "menu.img_caesar", title_key: "menu.caesar", desc_key: "menu.desc_caesar", img_position: "center 55%" },
            { img_key: "menu.img_salad_beef", title_key: "menu.salad_beef", desc_key: "menu.desc_salad_beef", img_position: "center center" },
            { img_key: "menu.img_eggplant", title_key: "menu.eggplant", desc_key: "menu.desc_eggplant", img_position: "center center" },
            { img_key: "menu.img_achichuk", title_key: "menu.achichuk", desc_key: "menu.desc_achichuk", img_position: "center center" },
            { img_key: "menu.img_garden_salad", title_key: "menu.garden_salad", desc_key: "menu.desc_garden_salad", img_position: "center center" },
            { img_key: "menu.img_salad_vitamin", title_key: "menu.salad_vitamin", desc_key: "menu.desc_salad_vitamin", img_position: "center center" },
            { img_key: "menu.img_cabbage_salad", title_key: "menu.cabbage_salad", desc_key: "menu.desc_cabbage_salad", img_position: "center 56%" },
            { img_key: "menu.img_salad_beetroot", title_key: "menu.salad_beetroot", desc_key: "menu.desc_salad_beetroot", img_position: "center center" },
            { img_key: "menu.img_olivier_salad", title_key: "menu.olivier_salad", desc_key: "menu.desc_olivier_salad", img_position: "center center" },
            { img_key: "menu.img_shuba_salad", title_key: "menu.shuba_salad", desc_key: "menu.desc_shuba_salad", img_position: "center center" },
            { img_key: "menu.img_rice", title_key: "menu.rice", desc_key: "menu.desc_rice", img_position: "center 58%" }
        ]
    },
    // PAGE 4
    {
        category_key: "menu.cat_drinks",
        icon: "fa-glass-cheers",
        items: [
            { img_key: "menu.img_tea", title_key: "menu.tea", desc_key: "menu.desc_tea", img_position: "center center" },
            { img_key: "menu.img_coffee", title_key: "menu.coffee", desc_key: "menu.desc_coffee", img_position: "center center" },
            { img_key: "menu.img_juice", title_key: "menu.juice", desc_key: "menu.desc_juice", img_position: "center center" },
            { img_key: "menu.img_cold_drinks", title_key: "menu.cold_drinks", desc_key: "menu.desc_cold_drinks", img_position: "center center" },
            { img_key: "menu.img_wine", title_key: "menu.wine", desc_key: "menu.desc_wine", img_position: "center 48%" },
            { img_key: "menu.img_cocktail", title_key: "menu.cocktail", desc_key: "menu.desc_cocktail", img_position: "center center" }
        ]
    }
];

function initScrollAndMenu() {
    /* --- 1. Global Scroll to Top Button --- */
    console.log("initScrollAndMenu started");

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
            const curLang = localStorage.getItem('selectedLang') || 'en';
            const t = translations[curLang] || translations['en'];
            let titleVal = (t && t[item.title_key] && String(t[item.title_key]).trim() !== '') 
                ? t[item.title_key] 
                : ((translations['en'] && translations['en'][item.title_key]) || '');
            let descVal = (t && t[item.desc_key] && String(t[item.desc_key]).trim() !== '') 
                ? t[item.desc_key] 
                : ((translations['en'] && translations['en'][item.desc_key]) || '');

            if (item.title_key === 'menu.eggplant') {
                titleVal = titleVal.replace(/\s*\+\s*boiled rice/gi, '').replace(/\s*\+\s*qaynatilgan guruch/gi, '').replace(/\s*\+\s*вареный рис/gi, '').trim();
            }
            if (item.title_key === 'menu.wine') {
                if (typeof titleVal === 'string' && (titleVal.includes('& Beer') || titleVal.includes('va Pivo') || titleVal.includes('и Пиво'))) {
                    titleVal = (curLang === 'uz') ? "Qizil va Oq Vinolar (Sharob)" : (curLang === 'ru') ? "Красные и Белые Вина" : "Red & White Wines";
                }
            }
            if (item.desc_key === 'menu.desc_wine') {
                if (typeof descVal === 'string' && (descVal.includes('imported beverages') || descVal.includes('import ichimliklar') || descVal.includes('импортных напитков'))) {
                    descVal = (curLang === 'uz') ? "O'zbekistonning mashhur 'Bagizagan' va boshqa saralangan qizil hamda oq vinolari, shisha yoki bokalda tortiladi." : (curLang === 'ru') ? "Коллекция лучших узбекских вин 'Багизаган' и зарубежных сортов, подается в бокалах или бутылках." : "Selection of premium Uzbek and international red and white wines, served by the bottle or glass.";
                }
            }

            let initialSrc = (translations['en'] && translations['en'][item.img_key]) || '';
            if (item.img_key === 'menu.img_wine' && (initialSrc.includes('images (1).jpg') || initialSrc.includes('images%20(1).jpg'))) {
                initialSrc = 'images/wine.jpg?v=5.2';
            }
            if (item.img_key === 'menu.img_juice' && initialSrc.includes('Featured_Image_1_1.webp')) {
                initialSrc = 'images/fresh_juices.jpg?v=5.3';
            }
            if (item.img_key === 'menu.img_cocktail' && (initialSrc.includes('images.jpg') || initialSrc === 'images/images.jpg')) {
                initialSrc = 'images/cocktails.jpg?v=5.4';
            }
            if (item.img_key === 'menu.img_tea' && initialSrc.includes('Cups_of_green_and_black_tea')) {
                initialSrc = 'images/tea.webp?v=5.4';
            }
            if (item.img_key === 'menu.img_coffee' && (!initialSrc || initialSrc.trim() === '')) {
                initialSrc = 'images/coffee.webp?v=5.6';
            }
            if (item.img_key === 'menu.img_cold_drinks' && (!initialSrc || initialSrc.trim() === '')) {
                initialSrc = 'images/cold_drinks.jpg?v=5.5';
            }
            if (initialSrc) initialSrc = fixImgPath(initialSrc);
            let posStyle = item.img_position ? `style="object-position: ${item.img_position};"` : '';
            let imgHtml = item.img_key ? `
                <div class="menu-item-img-wrapper">
                    <img src="${initialSrc}" data-i18n-src="${item.img_key}" alt="Menu Item" loading="lazy" ${posStyle}>
                    <div class="menu-item-overlay"></div>
                </div>
            ` : '';
            return `
                <div class="menu-item-card">
                    ${imgHtml}
                    <div class="menu-item-info">
                        <h4 data-i18n="${item.title_key}">${titleVal}</h4>
                        <div class="menu-item-divider"></div>
                        <p data-i18n="${item.desc_key}">${descVal}</p>
                    </div>
                </div>
            `;
        }

        // Render Function
        window.renderMenu = function () {
            // Clear container
            menuContainer.innerHTML = '';

            // 1. Category Navigation Tabs
            const tabsNav = document.createElement('div');
            tabsNav.className = 'menu-category-tabs';
            tabsNav.setAttribute('role', 'tablist');
            tabsNav.setAttribute('aria-label', 'Menu categories');

            menuData.forEach((cat, idx) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `menu-tab-btn ${idx === currentPage ? 'active' : ''}`;
                btn.setAttribute('role', 'tab');
                btn.setAttribute('aria-selected', idx === currentPage ? 'true' : 'false');
                btn.innerHTML = `<i class="fas ${cat.icon || 'fa-utensils'}"></i> <span data-i18n="${cat.category_key}">Category</span>`;
                btn.addEventListener('click', () => {
                    if (currentPage !== idx) {
                        currentPage = idx;
                        renderMenu();
                        document.getElementById('menu-start').scrollIntoView({ behavior: 'smooth' });
                    }
                });
                tabsNav.appendChild(btn);
            });
            menuContainer.appendChild(tabsNav);

            // 2. Render Current Page Content
            const pageData = menuData[currentPage];
            if (pageData) {
                // Category Header Block
                const catHeader = document.createElement('div');
                catHeader.className = 'menu-category-header';
                catHeader.innerHTML = `
                    <div class="category-subtitle-badge">
                        <i class="fas fa-crown"></i> <span data-i18n="menu.rooftop_badge">Meros Rooftop Dining</span>
                    </div>
                    <h3 class="page-title" data-i18n="${pageData.category_key}">Loading...</h3>
                `;
                menuContainer.appendChild(catHeader);

                // Grid Container
                const grid = document.createElement('div');
                grid.className = 'menu-items-list';

                pageData.items.forEach(item => {
                    grid.innerHTML += createMenuItem(item);
                });
                menuContainer.appendChild(grid);
            }

            // 3. Controls (Prev / Next & Indicator)
            const controlsDiv = document.createElement('div');
            controlsDiv.className = 'menu-controls';
            controlsDiv.innerHTML = `
                <button id="prev-page" class="page-btn" ${currentPage === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> <span data-i18n="menu.btn_prev">Previous</span>
                </button>
                <div class="page-indicator-pill">
                    <span id="page-indicator">${currentPage + 1} / ${menuData.length}</span>
                </div>
                <button id="next-page" class="page-btn" ${currentPage === menuData.length - 1 ? 'disabled' : ''}>
                    <span data-i18n="menu.btn_next">Next</span> <i class="fas fa-arrow-right"></i>
                </button>
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
        // Load Flatpickr CSS
        if (!document.getElementById('flatpickr-css')) {
            const css = document.createElement('link');
            css.id = 'flatpickr-css';
            css.rel = 'stylesheet';
            css.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
            document.head.appendChild(css);
        }

        // Custom Theme for luxury look
        if (!document.getElementById('flatpickr-theme')) {
            const theme = document.createElement('style');
            theme.id = 'flatpickr-theme';
            theme.innerHTML = `
                .flatpickr-calendar { 
                    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2) !important; 
                    border: 1px solid rgba(212,175,55,0.3) !important; 
                    border-radius: 12px !important; 
                    font-family: 'Inter', sans-serif; 
                    width: 315px !important; /* Fixed width to prevent clipping */
                }
                .flatpickr-innerContainer { padding: 5px !important; }
                .flatpickr-day.selected, .flatpickr-day.startRange, .flatpickr-day.endRange { background: #D4AF37 !important; border-color: #D4AF37 !important; }
                .flatpickr-day.today { border-color: #D4AF37 !important; }
                .flatpickr-input { font-family: 'Inter', sans-serif !important; cursor: pointer !important; background-color: #fafafa; }
                input[type="date"]::-webkit-inner-spin-button,
                input[type="date"]::-webkit-calendar-picker-indicator { display: none; -webkit-appearance: none; }
            `;
            document.head.appendChild(theme);
        }

        const lang = localStorage.getItem('selectedLang') || 'en';

        let placeholderTexts = {
            'en': 'YYYY-MM-DD (Year-Month-Day)',
            'uz': 'YYYY-MM-DD (Yil-Oy-Kun)',
            'ru': 'ГГГГ-ММ-ДД (Год-Месяц-День)'
        };

        let warningTexts = {
            'en': 'The date you entered does not exist or is in the past. Please enter a valid date.',
            'uz': 'Siz kiritgan sana mavjud emas yoki o\'tib ketgan. Iltimos, to\'g\'ri sana kiriting.',
            'ru': 'Введенная вами дата не существует или уже прошла. Пожалуйста, введите правильную дату.'
        };

        const maskDateInput = (input) => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                let formatted = '';
                if (value.length > 0) {
                    formatted = value.substring(0, 4);
                    if (value.length > 4) {
                        formatted += '-' + value.substring(4, 6);
                    }
                    if (value.length > 6) {
                        formatted += '-' + value.substring(6, 8);
                    }
                }
                e.target.value = formatted;
                // Store exactly what the user typed to prevent Flatpickr's auto-fix
                e.target.dataset.lastTyped = formatted;
            });
        };

        const initializePickers = () => {
            const todayStr = new Date().toISOString().split('T')[0];

            const validateDate = (instance) => {
                // Use the raw typed value if available, else the input value
                const typedVal = instance.altInput ? instance.altInput.dataset.lastTyped : instance.input.value;
                const finalVal = instance.input.value;

                if (!typedVal && !finalVal) return;

                // Check if the typed value was an impossible date (like month 23)
                // If typedVal is different from finalVal, Flatpickr already "corrected" it
                let isInvalid = false;
                if (typedVal && typedVal.length === 10) {
                    const parts = typedVal.split('-');
                    const m = parseInt(parts[1], 10);
                    const d = parseInt(parts[2], 10);
                    const y = parseInt(parts[0], 10);
                    if (m < 1 || m > 12 || d < 1 || d > 31) isInvalid = true;
                    if (!isInvalid) {
                        const daysInMonth = new Date(y, m, 0).getDate();
                        if (d > daysInMonth) isInvalid = true;
                    }
                }

                // If invalid or in the past
                if (isInvalid || (finalVal && finalVal < todayStr)) {
                    alert(warningTexts[lang] || warningTexts['en']);
                    instance.clear();
                    if (instance.altInput) {
                        instance.altInput.value = '';
                        instance.altInput.dataset.lastTyped = '';
                    }
                }
            };

            const commonConfig = {
                minDate: "today",
                altInput: true,
                altFormat: "Y-m-d",
                dateFormat: "Y-m-d",
                allowInput: true,
                disableMobile: true,
                static: false, // Make it float to avoid being cut off by containers
                position: "auto",
                placeholder: placeholderTexts[lang] || "YYYY-MM-DD",
                altInputClass: "flatpickr-input-custom",
                onReady: function (selectedDates, dateStr, instance) {
                    maskDateInput(instance.altInput || instance.input);
                    if (instance.altInput) {
                        instance.altInput.placeholder = placeholderTexts[lang] || "YYYY-MM-DD";
                        instance.altInput.addEventListener('focus', function () { this.placeholder = ''; });
                        instance.altInput.addEventListener('blur', function () {
                            if (!this.value) this.placeholder = placeholderTexts[lang] || "YYYY-MM-DD";
                            validateDate(instance);
                        });
                    }
                },
                onClose: function (selectedDates, dateStr, instance) {
                    validateDate(instance);
                }
            };

            window.checkOutPickerInstance = flatpickr(checkOut, {
                ...commonConfig
            });

            window.checkInPickerInstance = flatpickr(checkIn, {
                ...commonConfig,
                onChange: function (selectedDates, dateStr, instance) {
                    const minOutDate = dateStr || "today";
                    if (window.checkOutPickerInstance) {
                        window.checkOutPickerInstance.set('minDate', minOutDate);
                        // If Check-out date is already selected and it's before new Check-in, clear it
                        const currentOut = window.checkOutPickerInstance.input.value;
                        if (currentOut && currentOut < dateStr) {
                            window.checkOutPickerInstance.clear();
                            if (window.checkOutPickerInstance.altInput) window.checkOutPickerInstance.altInput.value = '';
                        }
                    }
                }
            });
        };

        // Load flatpickr script
        if (typeof flatpickr === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
            script.onload = initializePickers;
            document.head.appendChild(script);
        } else {
            initializePickers();
        }
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
