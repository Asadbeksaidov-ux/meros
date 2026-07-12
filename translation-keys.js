/**
 * translation-keys.js
 * =====================================================
 * Central schema of every data-i18n / data-i18n-src key
 * used across the Meros B&B website.
 *
 * Format per entry:
 *  key       – the data-i18n attribute value (unique string)
 *  label     – human-readable label shown in the admin editor
 *  type      – 'text' | 'image' | 'price'
 *  editable  – true = shown in the visual editor; false = structural/skip
 *  langs     – array of language codes that need a translation ['en','uz','ru']
 *  category  – top-level section for the admin editor tabs
 *  group     – sub-group label within a tab
 *  pages     – which HTML pages reference this key (for documentation)
 * =====================================================
 */

const TRANSLATION_KEYS = [

  // =====================================================
  // CATEGORY: rooms  (tab: Rooms & Prices)
  // =====================================================

  // --- Room card images (rooms.html) ---
  { key: 'rooms.img_double',         label: 'Double Room – Cover Image',       type: 'image',  editable: true,  langs: [],           category: 'rooms', group: 'Room Images',  pages: ['rooms.html'] },
  { key: 'rooms.img_twin',           label: 'Twin Room – Cover Image',         type: 'image',  editable: true,  langs: [],           category: 'rooms', group: 'Room Images',  pages: ['rooms.html'] },
  { key: 'rooms.img_triple',         label: 'Triple Room – Cover Image',       type: 'image',  editable: true,  langs: [],           category: 'rooms', group: 'Room Images',  pages: ['rooms.html'] },
  { key: 'rooms.img_twin_balcony',   label: 'Twin Balcony – Cover Image',      type: 'image',  editable: true,  langs: [],           category: 'rooms', group: 'Room Images',  pages: ['rooms.html'] },
  { key: 'rooms.img_double_balcony', label: 'Double Balcony – Cover Image',    type: 'image',  editable: true,  langs: [],           category: 'rooms', group: 'Room Images',  pages: ['rooms.html'] },

  // --- Room card prices (rooms.html list page) ---
  { key: 'rooms.price_double',         label: 'Double Room – Price',           type: 'price',  editable: true,  langs: ['en','uz','ru'], category: 'rooms', group: 'Room Prices (List)', pages: ['rooms.html'] },
  { key: 'rooms.price_twin',           label: 'Twin Room – Price',             type: 'price',  editable: true,  langs: ['en','uz','ru'], category: 'rooms', group: 'Room Prices (List)', pages: ['rooms.html'] },
  { key: 'rooms.price_triple',         label: 'Triple Room – Price',           type: 'price',  editable: true,  langs: ['en','uz','ru'], category: 'rooms', group: 'Room Prices (List)', pages: ['rooms.html'] },
  { key: 'rooms.price_twin_balcony',   label: 'Twin Balcony – Price',          type: 'price',  editable: true,  langs: ['en','uz','ru'], category: 'rooms', group: 'Room Prices (List)', pages: ['rooms.html'] },
  { key: 'rooms.price_double_balcony', label: 'Double Balcony – Price',        type: 'price',  editable: true,  langs: ['en','uz','ru'], category: 'rooms', group: 'Room Prices (List)', pages: ['rooms.html'] },


  // =====================================================
  // CATEGORY: tours  (tab: Tours & Transfers Prices)
  // =====================================================

  // --- Day trip prices (private_day.html) ---
  { key: 'tour_day.price_3f_sedan',   label: '3 Fortresses – Sedan (1-3 pax)',   type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 3 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_3f_suv',     label: '3 Fortresses – SUV (1-4 pax)',     type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 3 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_3f_minivan', label: '3 Fortresses – Minivan (1-6 pax)', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 3 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_3f_minibus', label: '3 Fortresses – Minibus (1-10 pax)',type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 3 Fortresses',  pages: ['private_day.html'] },

  { key: 'tour_day.price_5f_sedan',   label: '5 Fortresses – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 5 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_5f_suv',     label: '5 Fortresses – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 5 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_5f_minivan', label: '5 Fortresses – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 5 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_5f_minibus', label: '5 Fortresses – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 5 Fortresses',  pages: ['private_day.html'] },

  { key: 'tour_day.price_7f_sedan',   label: '7 Fortresses – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 7 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_7f_suv',     label: '7 Fortresses – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 7 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_7f_minivan', label: '7 Fortresses – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 7 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_7f_minibus', label: '7 Fortresses – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 7 Fortresses',  pages: ['private_day.html'] },

  { key: 'tour_day.price_9f_sedan',   label: '9 Fortresses – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 9 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_9f_suv',     label: '9 Fortresses – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 9 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_9f_minivan', label: '9 Fortresses – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 9 Fortresses',  pages: ['private_day.html'] },
  { key: 'tour_day.price_9f_minibus', label: '9 Fortresses – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – 9 Fortresses',  pages: ['private_day.html'] },

  { key: 'tour_day.price_badai_sedan',   label: 'Badai Tugai – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Special',  pages: ['private_day.html'] },
  { key: 'tour_day.price_badai_suv',     label: 'Badai Tugai – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Special',  pages: ['private_day.html'] },
  { key: 'tour_day.price_badai_minivan', label: 'Badai Tugai – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Special',  pages: ['private_day.html'] },
  { key: 'tour_day.price_badai_minibus', label: 'Badai Tugai – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Special',  pages: ['private_day.html'] },

  { key: 'tour_day.price_nukus_sedan',   label: 'Nukus Museum Tour – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_suv',     label: 'Nukus Museum Tour – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_minivan', label: 'Nukus Museum Tour – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_minibus', label: 'Nukus Museum Tour – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },

  { key: 'tour_day.price_nukus_miz_sedan',   label: 'Nukus+Mizdakhan – Sedan',   type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_miz_suv',     label: 'Nukus+Mizdakhan – SUV',     type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_miz_minivan', label: 'Nukus+Mizdakhan – Minivan', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_miz_minibus', label: 'Nukus+Mizdakhan – Minibus', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },

  { key: 'tour_day.price_muynak_sedan',   label: 'Muynak Ship Cemetery – Sedan',   type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_muynak_suv',     label: 'Muynak Ship Cemetery – SUV',     type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_muynak_minivan', label: 'Muynak Ship Cemetery – Minivan', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_muynak_minibus', label: 'Muynak Ship Cemetery – Minibus', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },

  { key: 'tour_day.price_nukus_fort_sedan',   label: 'Nukus via Fortresses – Sedan',   type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_fort_suv',     label: 'Nukus via Fortresses – SUV',     type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_fort_minivan', label: 'Nukus via Fortresses – Minivan', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },
  { key: 'tour_day.price_nukus_fort_minibus', label: 'Nukus via Fortresses – Minibus', type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Day Trip Prices – Nukus',  pages: ['private_day.html'] },

  // Khiva walking tour
  { key: 'khiva.price_val', label: 'Khiva Walking Tour – Price', type: 'price', editable: true, langs: ['en','uz','ru'], category: 'tours', group: 'Khiva Walking Tour', pages: ['khiva_tour.html'] },

  // --- Transfer prices (private_transfer.html) ---
  { key: 'transfers.price_railway_sedan',   label: 'Khiva Station-Hotel – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_railway_suv',     label: 'Khiva Station-Hotel – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_railway_minivan', label: 'Khiva Station-Hotel – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_railway_minibus', label: 'Khiva Station-Hotel – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },

  { key: 'transfers.price_urgench_sedan',   label: 'Khiva-Urgench Airport – Sedan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_urgench_suv',     label: 'Khiva-Urgench Airport – SUV',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_urgench_minivan', label: 'Khiva-Urgench Airport – Minivan',type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },
  { key: 'transfers.price_urgench_minibus', label: 'Khiva-Urgench Airport – Minibus',type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Local',         pages: ['private_transfer.html'] },

  { key: 'transfers.price_shavat_sedan',   label: 'Khiva-Shavat Border – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_shavat_suv',     label: 'Khiva-Shavat Border – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_shavat_minivan', label: 'Khiva-Shavat Border – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_shavat_minibus', label: 'Khiva-Shavat Border – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },

  { key: 'transfers.price_nukus_sedan',   label: 'Khiva↔Nukus – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_nukus_suv',     label: 'Khiva↔Nukus – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_nukus_minivan', label: 'Khiva↔Nukus – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_nukus_minibus', label: 'Khiva↔Nukus – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },

  { key: 'transfers.price_bukhara_sedan',   label: 'Khiva↔Bukhara – Sedan',    type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_bukhara_suv',     label: 'Khiva↔Bukhara – SUV',      type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_bukhara_minivan', label: 'Khiva↔Bukhara – Minivan',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },
  { key: 'transfers.price_bukhara_minibus', label: 'Khiva↔Bukhara – Minibus',  type: 'price', editable: true, langs: ['en'], category: 'tours', group: 'Transfer Prices – Intercity',     pages: ['private_transfer.html'] },

  // =====================================================
  // CATEGORY: homepage  (tab: Homepage Text)
  // =====================================================
  { key: 'home.hero_title',     label: 'Hero – Main Title',        type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'Hero Section',   pages: ['index.html'] },
  { key: 'hero.title',          label: 'Hero – Subtitle',          type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'Hero Section',   pages: ['index.html'] },
  { key: 'hero.subtitle',       label: 'Hero – Description',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'Hero Section',   pages: ['index.html'] },
  { key: 'about_main.title',    label: 'About – Section Title',    type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'About Section',  pages: ['index.html'] },
  { key: 'about_main.p1',       label: 'About – Paragraph 1',     type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'About Section',  pages: ['index.html'] },
  { key: 'about_main.p2',       label: 'About – Paragraph 2',     type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'About Section',  pages: ['index.html'] },
  { key: 'about.text',          label: 'Services – Description',   type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'Services',       pages: ['index.html'] },
  { key: 'map.full_address',    label: 'Map – Address',            type: 'text', editable: true, langs: ['en','uz','ru'], category: 'homepage', group: 'Contact',        pages: ['index.html'] },

  // =====================================================
  // CATEGORY: dining  (tab: Dining Text)
  // =====================================================
  { key: 'dining.hero_title',    label: 'Dining Hero – Title',    type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Hero', pages: ['restaurant.html'] },
  { key: 'dining.hero_subtitle', label: 'Dining Hero – Subtitle', type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Hero', pages: ['restaurant.html'] },
  { key: 'dining.shivit_price',  label: 'Menu – Shivit Oshi price', type: 'price', editable: true, langs: ['en'], category: 'dining', group: 'Menu Prices', pages: ['restaurant.html'] },
  { key: 'dining.plov_price',    label: 'Menu – Plov price',        type: 'price', editable: true, langs: ['en'], category: 'dining', group: 'Menu Prices', pages: ['restaurant.html'] },
  // =====================================================
  // CATEGORY: pages  (tab: Main Pages & Banners)
  // =====================================================
  { key: 'page.img_home_hero',       label: 'Homepage – Main Background Hero', type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['index.html'] },
  { key: 'page.img_about',           label: 'Homepage – About Us Image',       type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['index.html'] },
  { key: 'page.img_rooms_hero',      label: 'Accommodation – Banner',          type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['rooms.html'] },
  { key: 'page.img_tours_hero',      label: 'Tours – Banner',                  type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['tours.html'] },
  { key: 'page.img_day_hero',        label: 'Day Trips – Banner',              type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['private_day.html'] },
  { key: 'page.img_transfer_hero',   label: 'Transfers – Banner',              type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['private_transfer.html'] },
  { key: 'page.img_restaurant_hero', label: 'Restaurant – Banner',             type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['restaurant.html'] },
  { key: 'page.img_gallery_hero',    label: 'Gallery – Banner',                type: 'image', editable: true, langs: [], category: 'pages', group: 'Page Banners', pages: ['gallery.html'] },

  // =====================================================
  // CATEGORY: dining  (tab: Rooftop Dining)
  // =====================================================
  // Images
  { key: 'menu.img_shivit',         label: 'Shivit Oshi – Image',    type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_tuxum_barak',    label: 'Tuxum Barak – Image',    type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_palov',          label: 'Plov – Image',           type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_manti',          label: 'Manti – Image',          type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_gumma',          label: 'Gumma – Image',          type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_qapshirma',      label: 'Qapshirma – Image',      type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_shashlik',       label: 'Shashlik – Image',       type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_somsa',          label: 'Somsa – Image',          type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_soup_barak',     label: 'Soup Barak – Image',     type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_tefteli',        label: 'Tefteli – Image',        type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_special_soup',   label: 'Special Soup – Image',   type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_galubsi',        label: 'Galubsi – Image',        type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_achichuk',       label: 'Achichuk – Image',       type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_garden_salad',   label: 'Garden Salad – Image',   type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_caesar',         label: 'Caesar Salad – Image',   type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_eggplant',       label: 'Eggplant Salad – Image', type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_tea',            label: 'Tea – Image',            type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_juice',          label: 'Juice – Image',          type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_wine',           label: 'Wine – Image',           type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },
  { key: 'menu.img_cocktail',       label: 'Cocktail – Image',       type: 'image', editable: true, langs: [], category: 'dining', group: 'Menu Items', pages: ['restaurant.html'] },

  // Text fields (Titles, Descriptions)
  { key: 'menu.shivit',             label: 'Shivit Oshi – Title',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_shivit',        label: 'Shivit Oshi – Desc',        type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'dining.shivit_price',     label: 'Shivit Oshi – Price',       type: 'price', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  
  { key: 'menu.tuxum_barak',        label: 'Tuxum Barak – Title',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_tuxum_barak',   label: 'Tuxum Barak – Desc',        type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  
  { key: 'menu.palov',              label: 'Plov – Title',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_palov',         label: 'Plov – Desc',               type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'dining.plov_price',       label: 'Plov – Price',              type: 'price', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.manti',              label: 'Manti – Title',             type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_manti',         label: 'Manti – Desc',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.gumma',              label: 'Gumma – Title',             type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_gumma',         label: 'Gumma – Desc',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.qapshirma',          label: 'Qapshirma – Title',         type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_qapshirma',     label: 'Qapshirma – Desc',          type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.shashlik',           label: 'Shashlik – Title',          type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_shashlik',      label: 'Shashlik – Desc',           type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.somsa',              label: 'Somsa – Title',             type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_somsa',         label: 'Somsa – Desc',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.soup_barak',         label: 'Soup Barak – Title',        type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_soup_barak',    label: 'Soup Barak – Desc',         type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.tefteli',            label: 'Tefteli – Title',           type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_tefteli',       label: 'Tefteli – Desc',            type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.special_soup',       label: 'Special Soup – Title',      type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_special_soup',  label: 'Special Soup – Desc',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.galubsi',            label: 'Galubsi – Title',           type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_galubsi',       label: 'Galubsi – Desc',            type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.achichuk',           label: 'Achichuk – Title',          type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_achichuk',      label: 'Achichuk – Desc',           type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.garden_salad',       label: 'Garden Salad – Title',      type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_garden_salad',  label: 'Garden Salad – Desc',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.caesar',             label: 'Caesar Salad – Title',      type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_caesar',        label: 'Caesar Salad – Desc',       type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.eggplant',           label: 'Eggplant Salad – Title',    type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_eggplant',      label: 'Eggplant Salad – Desc',     type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.tea',                label: 'Tea – Title',               type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_tea',           label: 'Tea – Desc',                type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.juice',              label: 'Juice – Title',             type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_juice',         label: 'Juice – Desc',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.wine',               label: 'Wine – Title',              type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_wine',          label: 'Wine – Desc',               type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },

  { key: 'menu.cocktail',           label: 'Cocktail – Title',          type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] },
  { key: 'menu.desc_cocktail',      label: 'Cocktail – Desc',           type: 'text', editable: true, langs: ['en','uz','ru'], category: 'dining', group: 'Menu Content', pages: ['restaurant.html'] }
];

// Helper: get keys by category
function getKeysByCategory(cat) {
  return TRANSLATION_KEYS.filter(k => k.category === cat && k.editable);
}

// Helper: get groups within a category
function getGroupsInCategory(cat) {
  const keys = getKeysByCategory(cat);
  return [...new Set(keys.map(k => k.group))];
}

// Helper: validate that a given key string is known
function isValidKey(keyStr) {
  return TRANSLATION_KEYS.some(k => k.key === keyStr);
}
