/**
 * ISO 3166-1 world country master data — 249 entries.
 *
 * Fields match the Prisma `Country` model exactly:
 *   code            — ISO 3166-1 alpha-2  (unique key for upsert)
 *   name            — English short name
 *   phoneCode       — ITU-T E.164 calling code prefix (with "+")
 *   currencyCode    — ISO 4217 primary currency
 *   timezoneDefault — IANA representative timezone
 *   latitude        — approximate geographic centre
 *   longitude       — approximate geographic centre
 *
 * Skipped (not in schema): iso3, region/continent, flagEmoji
 *
 * Maintenance: update only; do not remove rows that may already be in DB.
 */

export type WorldCountryRow = {
  code: string;
  name: string;
  phoneCode: string;
  currencyCode: string;
  timezoneDefault: string;
  latitude: number;
  longitude: number;
};

export const WORLD_COUNTRIES: WorldCountryRow[] = [
  // ── A ─────────────────────────────────────────────────────────────────────
  { code: "AF", name: "Afghanistan",                      phoneCode: "+93",   currencyCode: "AFN", timezoneDefault: "Asia/Kabul",                      latitude:  33.9391, longitude:   67.7100 },
  { code: "AL", name: "Albania",                          phoneCode: "+355",  currencyCode: "ALL", timezoneDefault: "Europe/Tirane",                   latitude:  41.1533, longitude:   20.1683 },
  { code: "DZ", name: "Algeria",                          phoneCode: "+213",  currencyCode: "DZD", timezoneDefault: "Africa/Algiers",                  latitude:  28.0339, longitude:    1.6596 },
  { code: "AS", name: "American Samoa",                   phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "Pacific/Pago_Pago",               latitude: -14.2710, longitude: -170.1322 },
  { code: "AD", name: "Andorra",                          phoneCode: "+376",  currencyCode: "EUR", timezoneDefault: "Europe/Andorra",                  latitude:  42.5063, longitude:    1.5218 },
  { code: "AO", name: "Angola",                           phoneCode: "+244",  currencyCode: "AOA", timezoneDefault: "Africa/Luanda",                   latitude: -11.2027, longitude:   17.8739 },
  { code: "AI", name: "Anguilla",                         phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/Anguilla",                latitude:  18.2206, longitude:  -63.0686 },
  { code: "AQ", name: "Antarctica",                       phoneCode: "+672",  currencyCode: "USD", timezoneDefault: "Antarctica/McMurdo",              latitude: -75.2509, longitude:  -0.0710 },
  { code: "AG", name: "Antigua and Barbuda",              phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/Antigua",                 latitude:  17.0608, longitude:  -61.7964 },
  { code: "AR", name: "Argentina",                        phoneCode: "+54",   currencyCode: "ARS", timezoneDefault: "America/Argentina/Buenos_Aires",  latitude: -38.4161, longitude:  -63.6167 },
  { code: "AM", name: "Armenia",                          phoneCode: "+374",  currencyCode: "AMD", timezoneDefault: "Asia/Yerevan",                    latitude:  40.0691, longitude:   45.0382 },
  { code: "AW", name: "Aruba",                            phoneCode: "+297",  currencyCode: "AWG", timezoneDefault: "America/Aruba",                   latitude:  12.5211, longitude:  -69.9683 },
  { code: "AU", name: "Australia",                        phoneCode: "+61",   currencyCode: "AUD", timezoneDefault: "Australia/Sydney",                latitude: -25.2744, longitude:  133.7751 },
  { code: "AT", name: "Austria",                          phoneCode: "+43",   currencyCode: "EUR", timezoneDefault: "Europe/Vienna",                   latitude:  47.5162, longitude:   14.5501 },
  { code: "AZ", name: "Azerbaijan",                       phoneCode: "+994",  currencyCode: "AZN", timezoneDefault: "Asia/Baku",                       latitude:  40.1431, longitude:   47.5769 },

  // ── B ─────────────────────────────────────────────────────────────────────
  { code: "BS", name: "Bahamas",                          phoneCode: "+1",    currencyCode: "BSD", timezoneDefault: "America/Nassau",                  latitude:  25.0343, longitude:  -77.3963 },
  { code: "BH", name: "Bahrain",                          phoneCode: "+973",  currencyCode: "BHD", timezoneDefault: "Asia/Bahrain",                    latitude:  25.9304, longitude:   50.6378 },
  { code: "BD", name: "Bangladesh",                       phoneCode: "+880",  currencyCode: "BDT", timezoneDefault: "Asia/Dhaka",                      latitude:  23.6850, longitude:   90.3563 },
  { code: "BB", name: "Barbados",                         phoneCode: "+1",    currencyCode: "BBD", timezoneDefault: "America/Barbados",                latitude:  13.1939, longitude:  -59.5432 },
  { code: "BY", name: "Belarus",                          phoneCode: "+375",  currencyCode: "BYN", timezoneDefault: "Europe/Minsk",                    latitude:  53.7098, longitude:   27.9534 },
  { code: "BE", name: "Belgium",                          phoneCode: "+32",   currencyCode: "EUR", timezoneDefault: "Europe/Brussels",                 latitude:  50.5039, longitude:    4.4699 },
  { code: "BZ", name: "Belize",                           phoneCode: "+501",  currencyCode: "BZD", timezoneDefault: "America/Belize",                  latitude:  17.1899, longitude:  -88.4976 },
  { code: "BJ", name: "Benin",                            phoneCode: "+229",  currencyCode: "XOF", timezoneDefault: "Africa/Porto-Novo",               latitude:   9.3077, longitude:    2.3158 },
  { code: "BM", name: "Bermuda",                          phoneCode: "+1",    currencyCode: "BMD", timezoneDefault: "Atlantic/Bermuda",                latitude:  32.3078, longitude:  -64.7505 },
  { code: "BT", name: "Bhutan",                           phoneCode: "+975",  currencyCode: "BTN", timezoneDefault: "Asia/Thimphu",                    latitude:  27.5142, longitude:   90.4336 },
  { code: "BO", name: "Bolivia",                          phoneCode: "+591",  currencyCode: "BOB", timezoneDefault: "America/La_Paz",                  latitude: -16.2902, longitude:  -63.5887 },
  { code: "BQ", name: "Bonaire, Sint Eustatius and Saba", phoneCode: "+599",  currencyCode: "USD", timezoneDefault: "America/Kralendijk",              latitude:  12.1784, longitude:  -68.2385 },
  { code: "BA", name: "Bosnia and Herzegovina",           phoneCode: "+387",  currencyCode: "BAM", timezoneDefault: "Europe/Sarajevo",                 latitude:  43.9159, longitude:   17.6791 },
  { code: "BW", name: "Botswana",                         phoneCode: "+267",  currencyCode: "BWP", timezoneDefault: "Africa/Gaborone",                 latitude: -22.3285, longitude:   24.6849 },
  { code: "BV", name: "Bouvet Island",                    phoneCode: "+47",   currencyCode: "NOK", timezoneDefault: "Europe/Oslo",                     latitude: -54.4208, longitude:    3.3464 },
  { code: "BR", name: "Brazil",                           phoneCode: "+55",   currencyCode: "BRL", timezoneDefault: "America/Sao_Paulo",               latitude: -14.2350, longitude:  -51.9253 },
  { code: "IO", name: "British Indian Ocean Territory",   phoneCode: "+246",  currencyCode: "USD", timezoneDefault: "Indian/Chagos",                   latitude:  -7.3667, longitude:   72.4167 },
  { code: "BN", name: "Brunei",                           phoneCode: "+673",  currencyCode: "BND", timezoneDefault: "Asia/Brunei",                     latitude:   4.5353, longitude:  114.7277 },
  { code: "BG", name: "Bulgaria",                         phoneCode: "+359",  currencyCode: "BGN", timezoneDefault: "Europe/Sofia",                    latitude:  42.7339, longitude:   25.4858 },
  { code: "BF", name: "Burkina Faso",                     phoneCode: "+226",  currencyCode: "XOF", timezoneDefault: "Africa/Ouagadougou",              latitude:  12.3641, longitude:   -1.5197 },
  { code: "BI", name: "Burundi",                          phoneCode: "+257",  currencyCode: "BIF", timezoneDefault: "Africa/Bujumbura",                latitude:  -3.3731, longitude:   29.9189 },

  // ── C ─────────────────────────────────────────────────────────────────────
  { code: "CV", name: "Cabo Verde",                       phoneCode: "+238",  currencyCode: "CVE", timezoneDefault: "Atlantic/Cape_Verde",             latitude:  16.5388, longitude:  -23.0418 },
  { code: "KH", name: "Cambodia",                         phoneCode: "+855",  currencyCode: "KHR", timezoneDefault: "Asia/Phnom_Penh",                 latitude:  12.5657, longitude:  104.9910 },
  { code: "CM", name: "Cameroon",                         phoneCode: "+237",  currencyCode: "XAF", timezoneDefault: "Africa/Douala",                   latitude:   7.3697, longitude:   12.3547 },
  { code: "CA", name: "Canada",                           phoneCode: "+1",    currencyCode: "CAD", timezoneDefault: "America/Toronto",                 latitude:  56.1304, longitude: -106.3468 },
  { code: "KY", name: "Cayman Islands",                   phoneCode: "+1",    currencyCode: "KYD", timezoneDefault: "America/Cayman",                  latitude:  19.5133, longitude:  -80.5669 },
  { code: "CF", name: "Central African Republic",         phoneCode: "+236",  currencyCode: "XAF", timezoneDefault: "Africa/Bangui",                   latitude:   6.6111, longitude:   20.9394 },
  { code: "TD", name: "Chad",                             phoneCode: "+235",  currencyCode: "XAF", timezoneDefault: "Africa/Ndjamena",                 latitude:  15.4542, longitude:   18.7322 },
  { code: "CL", name: "Chile",                            phoneCode: "+56",   currencyCode: "CLP", timezoneDefault: "America/Santiago",                latitude: -35.6751, longitude:  -71.5430 },
  { code: "CN", name: "China",                            phoneCode: "+86",   currencyCode: "CNY", timezoneDefault: "Asia/Shanghai",                   latitude:  35.8617, longitude:  104.1954 },
  { code: "CX", name: "Christmas Island",                 phoneCode: "+61",   currencyCode: "AUD", timezoneDefault: "Indian/Christmas",                latitude: -10.4914, longitude:  105.6312 },
  { code: "CC", name: "Cocos (Keeling) Islands",          phoneCode: "+61",   currencyCode: "AUD", timezoneDefault: "Indian/Cocos",                    latitude: -12.1642, longitude:   96.8710 },
  { code: "CO", name: "Colombia",                         phoneCode: "+57",   currencyCode: "COP", timezoneDefault: "America/Bogota",                  latitude:   4.5709, longitude:  -74.2973 },
  { code: "KM", name: "Comoros",                          phoneCode: "+269",  currencyCode: "KMF", timezoneDefault: "Indian/Comoro",                   latitude: -11.6455, longitude:   43.3333 },
  { code: "CG", name: "Congo",                            phoneCode: "+242",  currencyCode: "XAF", timezoneDefault: "Africa/Brazzaville",              latitude:  -0.2280, longitude:   15.8277 },
  { code: "CD", name: "Congo (DRC)",                      phoneCode: "+243",  currencyCode: "CDF", timezoneDefault: "Africa/Kinshasa",                 latitude:  -4.0383, longitude:   21.7587 },
  { code: "CK", name: "Cook Islands",                     phoneCode: "+682",  currencyCode: "NZD", timezoneDefault: "Pacific/Rarotonga",               latitude: -21.2367, longitude: -159.7777 },
  { code: "CR", name: "Costa Rica",                       phoneCode: "+506",  currencyCode: "CRC", timezoneDefault: "America/Costa_Rica",              latitude:   9.7489, longitude:  -83.7534 },
  { code: "CI", name: "Côte d'Ivoire",                    phoneCode: "+225",  currencyCode: "XOF", timezoneDefault: "Africa/Abidjan",                  latitude:   7.5400, longitude:   -5.5471 },
  { code: "HR", name: "Croatia",                          phoneCode: "+385",  currencyCode: "EUR", timezoneDefault: "Europe/Zagreb",                   latitude:  45.1000, longitude:   15.2000 },
  { code: "CU", name: "Cuba",                             phoneCode: "+53",   currencyCode: "CUP", timezoneDefault: "America/Havana",                  latitude:  21.5218, longitude:  -77.7812 },
  { code: "CW", name: "Curaçao",                          phoneCode: "+599",  currencyCode: "ANG", timezoneDefault: "America/Curacao",                 latitude:  12.1696, longitude:  -68.9900 },
  { code: "CY", name: "Cyprus",                           phoneCode: "+357",  currencyCode: "EUR", timezoneDefault: "Asia/Nicosia",                    latitude:  35.1264, longitude:   33.4299 },
  { code: "CZ", name: "Czechia",                          phoneCode: "+420",  currencyCode: "CZK", timezoneDefault: "Europe/Prague",                   latitude:  49.8175, longitude:   15.4730 },

  // ── D ─────────────────────────────────────────────────────────────────────
  { code: "DK", name: "Denmark",                          phoneCode: "+45",   currencyCode: "DKK", timezoneDefault: "Europe/Copenhagen",               latitude:  56.2639, longitude:    9.5018 },
  { code: "DJ", name: "Djibouti",                         phoneCode: "+253",  currencyCode: "DJF", timezoneDefault: "Africa/Djibouti",                 latitude:  11.8251, longitude:   42.5903 },
  { code: "DM", name: "Dominica",                         phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/Dominica",                latitude:  15.4150, longitude:  -61.3710 },
  { code: "DO", name: "Dominican Republic",               phoneCode: "+1",    currencyCode: "DOP", timezoneDefault: "America/Santo_Domingo",           latitude:  18.7357, longitude:  -70.1627 },

  // ── E ─────────────────────────────────────────────────────────────────────
  { code: "EC", name: "Ecuador",                          phoneCode: "+593",  currencyCode: "USD", timezoneDefault: "America/Guayaquil",               latitude:  -1.8312, longitude:  -78.1834 },
  { code: "EG", name: "Egypt",                            phoneCode: "+20",   currencyCode: "EGP", timezoneDefault: "Africa/Cairo",                    latitude:  26.8206, longitude:   30.8025 },
  { code: "SV", name: "El Salvador",                      phoneCode: "+503",  currencyCode: "USD", timezoneDefault: "America/El_Salvador",             latitude:  13.7942, longitude:  -88.8965 },
  { code: "GQ", name: "Equatorial Guinea",                phoneCode: "+240",  currencyCode: "XAF", timezoneDefault: "Africa/Malabo",                   latitude:   1.6508, longitude:   10.2679 },
  { code: "ER", name: "Eritrea",                          phoneCode: "+291",  currencyCode: "ERN", timezoneDefault: "Africa/Asmara",                   latitude:  15.1794, longitude:   39.7823 },
  { code: "EE", name: "Estonia",                          phoneCode: "+372",  currencyCode: "EUR", timezoneDefault: "Europe/Tallinn",                  latitude:  58.5953, longitude:   25.0136 },
  { code: "SZ", name: "Eswatini",                         phoneCode: "+268",  currencyCode: "SZL", timezoneDefault: "Africa/Mbabane",                  latitude: -26.5225, longitude:   31.4659 },
  { code: "ET", name: "Ethiopia",                         phoneCode: "+251",  currencyCode: "ETB", timezoneDefault: "Africa/Addis_Ababa",              latitude:   9.1450, longitude:   40.4897 },

  // ── F ─────────────────────────────────────────────────────────────────────
  { code: "FK", name: "Falkland Islands",                 phoneCode: "+500",  currencyCode: "FKP", timezoneDefault: "Atlantic/Stanley",                latitude: -51.7963, longitude:  -59.5236 },
  { code: "FO", name: "Faroe Islands",                    phoneCode: "+298",  currencyCode: "DKK", timezoneDefault: "Atlantic/Faroe",                  latitude:  61.8926, longitude:   -6.9118 },
  { code: "FJ", name: "Fiji",                             phoneCode: "+679",  currencyCode: "FJD", timezoneDefault: "Pacific/Fiji",                    latitude: -16.5782, longitude:  179.4144 },
  { code: "FI", name: "Finland",                          phoneCode: "+358",  currencyCode: "EUR", timezoneDefault: "Europe/Helsinki",                 latitude:  61.9241, longitude:   25.7482 },
  { code: "FR", name: "France",                           phoneCode: "+33",   currencyCode: "EUR", timezoneDefault: "Europe/Paris",                    latitude:  46.2276, longitude:    2.2137 },
  { code: "GF", name: "French Guiana",                    phoneCode: "+594",  currencyCode: "EUR", timezoneDefault: "America/Cayenne",                 latitude:   3.9339, longitude:  -53.1258 },
  { code: "PF", name: "French Polynesia",                 phoneCode: "+689",  currencyCode: "XPF", timezoneDefault: "Pacific/Tahiti",                  latitude: -17.6797, longitude: -149.4068 },
  { code: "TF", name: "French Southern Territories",      phoneCode: "+262",  currencyCode: "EUR", timezoneDefault: "Indian/Kerguelen",                latitude: -49.2804, longitude:   69.3486 },

  // ── G ─────────────────────────────────────────────────────────────────────
  { code: "GA", name: "Gabon",                            phoneCode: "+241",  currencyCode: "XAF", timezoneDefault: "Africa/Libreville",               latitude:  -0.8037, longitude:   11.6094 },
  { code: "GM", name: "Gambia",                           phoneCode: "+220",  currencyCode: "GMD", timezoneDefault: "Africa/Banjul",                   latitude:  13.4432, longitude:  -15.3101 },
  { code: "GE", name: "Georgia",                          phoneCode: "+995",  currencyCode: "GEL", timezoneDefault: "Asia/Tbilisi",                    latitude:  42.3154, longitude:   43.3569 },
  { code: "DE", name: "Germany",                          phoneCode: "+49",   currencyCode: "EUR", timezoneDefault: "Europe/Berlin",                   latitude:  51.1657, longitude:   10.4515 },
  { code: "GH", name: "Ghana",                            phoneCode: "+233",  currencyCode: "GHS", timezoneDefault: "Africa/Accra",                    latitude:   7.9465, longitude:   -1.0232 },
  { code: "GI", name: "Gibraltar",                        phoneCode: "+350",  currencyCode: "GIP", timezoneDefault: "Europe/Gibraltar",                latitude:  36.1408, longitude:   -5.3536 },
  { code: "GR", name: "Greece",                           phoneCode: "+30",   currencyCode: "EUR", timezoneDefault: "Europe/Athens",                   latitude:  39.0742, longitude:   21.8243 },
  { code: "GL", name: "Greenland",                        phoneCode: "+299",  currencyCode: "DKK", timezoneDefault: "America/Godthab",                 latitude:  71.7069, longitude:  -42.6043 },
  { code: "GD", name: "Grenada",                          phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/Grenada",                 latitude:  12.1165, longitude:  -61.6790 },
  { code: "GP", name: "Guadeloupe",                       phoneCode: "+590",  currencyCode: "EUR", timezoneDefault: "America/Guadeloupe",              latitude:  16.9950, longitude:  -62.0674 },
  { code: "GU", name: "Guam",                             phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "Pacific/Guam",                    latitude:  13.4443, longitude:  144.7937 },
  { code: "GT", name: "Guatemala",                        phoneCode: "+502",  currencyCode: "GTQ", timezoneDefault: "America/Guatemala",               latitude:  15.7835, longitude:  -90.2308 },
  { code: "GG", name: "Guernsey",                         phoneCode: "+44",   currencyCode: "GBP", timezoneDefault: "Europe/Guernsey",                 latitude:  49.4657, longitude:   -2.5853 },
  { code: "GN", name: "Guinea",                           phoneCode: "+224",  currencyCode: "GNF", timezoneDefault: "Africa/Conakry",                  latitude:   9.9456, longitude:  -11.2148 },
  { code: "GW", name: "Guinea-Bissau",                    phoneCode: "+245",  currencyCode: "XOF", timezoneDefault: "Africa/Bissau",                   latitude:  11.8037, longitude:  -15.1804 },
  { code: "GY", name: "Guyana",                           phoneCode: "+592",  currencyCode: "GYD", timezoneDefault: "America/Guyana",                  latitude:   4.8604, longitude:  -58.9302 },

  // ── H ─────────────────────────────────────────────────────────────────────
  { code: "HT", name: "Haiti",                            phoneCode: "+509",  currencyCode: "HTG", timezoneDefault: "America/Port-au-Prince",          latitude:  18.9712, longitude:  -72.2852 },
  { code: "HM", name: "Heard Island and McDonald Islands",phoneCode: "+672",  currencyCode: "AUD", timezoneDefault: "Indian/Kerguelen",                latitude: -53.0818, longitude:   73.5042 },
  { code: "VA", name: "Holy See (Vatican City)",          phoneCode: "+379",  currencyCode: "EUR", timezoneDefault: "Europe/Vatican",                  latitude:  41.9029, longitude:   12.4534 },
  { code: "HN", name: "Honduras",                         phoneCode: "+504",  currencyCode: "HNL", timezoneDefault: "America/Tegucigalpa",             latitude:  15.1998, longitude:  -86.2419 },
  { code: "HK", name: "Hong Kong",                        phoneCode: "+852",  currencyCode: "HKD", timezoneDefault: "Asia/Hong_Kong",                  latitude:  22.3193, longitude:  114.1694 },
  { code: "HU", name: "Hungary",                          phoneCode: "+36",   currencyCode: "HUF", timezoneDefault: "Europe/Budapest",                 latitude:  47.1625, longitude:   19.5033 },

  // ── I ─────────────────────────────────────────────────────────────────────
  { code: "IS", name: "Iceland",                          phoneCode: "+354",  currencyCode: "ISK", timezoneDefault: "Atlantic/Reykjavik",              latitude:  64.9631, longitude:  -19.0208 },
  { code: "IN", name: "India",                            phoneCode: "+91",   currencyCode: "INR", timezoneDefault: "Asia/Kolkata",                    latitude:  20.5937, longitude:   78.9629 },
  { code: "ID", name: "Indonesia",                        phoneCode: "+62",   currencyCode: "IDR", timezoneDefault: "Asia/Jakarta",                    latitude:  -0.7893, longitude:  113.9213 },
  { code: "IR", name: "Iran",                             phoneCode: "+98",   currencyCode: "IRR", timezoneDefault: "Asia/Tehran",                     latitude:  32.4279, longitude:   53.6880 },
  { code: "IQ", name: "Iraq",                             phoneCode: "+964",  currencyCode: "IQD", timezoneDefault: "Asia/Baghdad",                    latitude:  33.2232, longitude:   43.6793 },
  { code: "IE", name: "Ireland",                          phoneCode: "+353",  currencyCode: "EUR", timezoneDefault: "Europe/Dublin",                   latitude:  53.1424, longitude:   -7.6921 },
  { code: "IM", name: "Isle of Man",                      phoneCode: "+44",   currencyCode: "GBP", timezoneDefault: "Europe/Isle_of_Man",              latitude:  54.2361, longitude:   -4.5481 },
  { code: "IL", name: "Israel",                           phoneCode: "+972",  currencyCode: "ILS", timezoneDefault: "Asia/Jerusalem",                  latitude:  31.0461, longitude:   34.8516 },
  { code: "IT", name: "Italy",                            phoneCode: "+39",   currencyCode: "EUR", timezoneDefault: "Europe/Rome",                     latitude:  41.8719, longitude:   12.5674 },

  // ── J ─────────────────────────────────────────────────────────────────────
  { code: "JM", name: "Jamaica",                          phoneCode: "+1",    currencyCode: "JMD", timezoneDefault: "America/Jamaica",                 latitude:  18.1096, longitude:  -77.2975 },
  { code: "JP", name: "Japan",                            phoneCode: "+81",   currencyCode: "JPY", timezoneDefault: "Asia/Tokyo",                      latitude:  36.2048, longitude:  138.2529 },
  { code: "JE", name: "Jersey",                           phoneCode: "+44",   currencyCode: "GBP", timezoneDefault: "Europe/Jersey",                   latitude:  49.1880, longitude:   -2.0924 },
  { code: "JO", name: "Jordan",                           phoneCode: "+962",  currencyCode: "JOD", timezoneDefault: "Asia/Amman",                      latitude:  30.5852, longitude:   36.2384 },

  // ── K ─────────────────────────────────────────────────────────────────────
  { code: "KZ", name: "Kazakhstan",                       phoneCode: "+7",    currencyCode: "KZT", timezoneDefault: "Asia/Almaty",                     latitude:  48.0196, longitude:   66.9237 },
  { code: "KE", name: "Kenya",                            phoneCode: "+254",  currencyCode: "KES", timezoneDefault: "Africa/Nairobi",                  latitude:  -0.0236, longitude:   37.9062 },
  { code: "KI", name: "Kiribati",                         phoneCode: "+686",  currencyCode: "AUD", timezoneDefault: "Pacific/Tarawa",                  latitude:   1.8709, longitude: -157.3626 },
  { code: "KP", name: "Korea (North)",                    phoneCode: "+850",  currencyCode: "KPW", timezoneDefault: "Asia/Pyongyang",                  latitude:  40.3399, longitude:  127.5101 },
  { code: "KR", name: "Korea (South)",                    phoneCode: "+82",   currencyCode: "KRW", timezoneDefault: "Asia/Seoul",                      latitude:  35.9078, longitude:  127.7669 },
  { code: "XK", name: "Kosovo",                           phoneCode: "+383",  currencyCode: "EUR", timezoneDefault: "Europe/Belgrade",                 latitude:  42.6026, longitude:   20.9030 },
  { code: "KW", name: "Kuwait",                           phoneCode: "+965",  currencyCode: "KWD", timezoneDefault: "Asia/Kuwait",                     latitude:  29.3117, longitude:   47.4818 },
  { code: "KG", name: "Kyrgyzstan",                       phoneCode: "+996",  currencyCode: "KGS", timezoneDefault: "Asia/Bishkek",                    latitude:  41.2044, longitude:   74.7661 },

  // ── L ─────────────────────────────────────────────────────────────────────
  { code: "LA", name: "Laos",                             phoneCode: "+856",  currencyCode: "LAK", timezoneDefault: "Asia/Vientiane",                  latitude:  19.8563, longitude:  102.4955 },
  { code: "LV", name: "Latvia",                           phoneCode: "+371",  currencyCode: "EUR", timezoneDefault: "Europe/Riga",                     latitude:  56.8796, longitude:   24.6032 },
  { code: "LB", name: "Lebanon",                          phoneCode: "+961",  currencyCode: "LBP", timezoneDefault: "Asia/Beirut",                     latitude:  33.8547, longitude:   35.8623 },
  { code: "LS", name: "Lesotho",                          phoneCode: "+266",  currencyCode: "LSL", timezoneDefault: "Africa/Maseru",                   latitude: -29.6100, longitude:   28.2336 },
  { code: "LR", name: "Liberia",                          phoneCode: "+231",  currencyCode: "LRD", timezoneDefault: "Africa/Monrovia",                 latitude:   6.4281, longitude:   -9.4295 },
  { code: "LY", name: "Libya",                            phoneCode: "+218",  currencyCode: "LYD", timezoneDefault: "Africa/Tripoli",                  latitude:  26.3351, longitude:   17.2283 },
  { code: "LI", name: "Liechtenstein",                    phoneCode: "+423",  currencyCode: "CHF", timezoneDefault: "Europe/Vaduz",                    latitude:  47.1660, longitude:    9.5554 },
  { code: "LT", name: "Lithuania",                        phoneCode: "+370",  currencyCode: "EUR", timezoneDefault: "Europe/Vilnius",                  latitude:  55.1694, longitude:   23.8813 },
  { code: "LU", name: "Luxembourg",                       phoneCode: "+352",  currencyCode: "EUR", timezoneDefault: "Europe/Luxembourg",               latitude:  49.8153, longitude:    6.1296 },

  // ── M ─────────────────────────────────────────────────────────────────────
  { code: "MO", name: "Macao",                            phoneCode: "+853",  currencyCode: "MOP", timezoneDefault: "Asia/Macau",                      latitude:  22.1987, longitude:  113.5439 },
  { code: "MG", name: "Madagascar",                       phoneCode: "+261",  currencyCode: "MGA", timezoneDefault: "Indian/Antananarivo",             latitude: -18.7669, longitude:   46.8691 },
  { code: "MW", name: "Malawi",                           phoneCode: "+265",  currencyCode: "MWK", timezoneDefault: "Africa/Blantyre",                 latitude: -13.2543, longitude:   34.3015 },
  { code: "MY", name: "Malaysia",                         phoneCode: "+60",   currencyCode: "MYR", timezoneDefault: "Asia/Kuala_Lumpur",               latitude:   4.2105, longitude:  101.9758 },
  { code: "MV", name: "Maldives",                         phoneCode: "+960",  currencyCode: "MVR", timezoneDefault: "Indian/Maldives",                 latitude:   4.1755, longitude:   73.5093 },
  { code: "ML", name: "Mali",                             phoneCode: "+223",  currencyCode: "XOF", timezoneDefault: "Africa/Bamako",                   latitude:  17.5707, longitude:   -3.9962 },
  { code: "MT", name: "Malta",                            phoneCode: "+356",  currencyCode: "EUR", timezoneDefault: "Europe/Malta",                    latitude:  35.9375, longitude:   14.3754 },
  { code: "MH", name: "Marshall Islands",                 phoneCode: "+692",  currencyCode: "USD", timezoneDefault: "Pacific/Majuro",                  latitude:   7.1315, longitude:  171.1845 },
  { code: "MQ", name: "Martinique",                       phoneCode: "+596",  currencyCode: "EUR", timezoneDefault: "America/Martinique",              latitude:  14.6415, longitude:  -61.0242 },
  { code: "MR", name: "Mauritania",                       phoneCode: "+222",  currencyCode: "MRU", timezoneDefault: "Africa/Nouakchott",               latitude:  21.0079, longitude:  -10.9408 },
  { code: "MU", name: "Mauritius",                        phoneCode: "+230",  currencyCode: "MUR", timezoneDefault: "Indian/Mauritius",                latitude: -20.3484, longitude:   57.5522 },
  { code: "YT", name: "Mayotte",                          phoneCode: "+262",  currencyCode: "EUR", timezoneDefault: "Indian/Mayotte",                  latitude: -12.8275, longitude:   45.1662 },
  { code: "MX", name: "Mexico",                           phoneCode: "+52",   currencyCode: "MXN", timezoneDefault: "America/Mexico_City",             latitude:  23.6345, longitude: -102.5528 },
  { code: "FM", name: "Micronesia",                       phoneCode: "+691",  currencyCode: "USD", timezoneDefault: "Pacific/Pohnpei",                 latitude:   7.4256, longitude:  150.5508 },
  { code: "MD", name: "Moldova",                          phoneCode: "+373",  currencyCode: "MDL", timezoneDefault: "Europe/Chisinau",                 latitude:  47.4116, longitude:   28.3699 },
  { code: "MC", name: "Monaco",                           phoneCode: "+377",  currencyCode: "EUR", timezoneDefault: "Europe/Monaco",                   latitude:  43.7333, longitude:    7.4000 },
  { code: "MN", name: "Mongolia",                         phoneCode: "+976",  currencyCode: "MNT", timezoneDefault: "Asia/Ulaanbaatar",                latitude:  46.8625, longitude:  103.8467 },
  { code: "ME", name: "Montenegro",                       phoneCode: "+382",  currencyCode: "EUR", timezoneDefault: "Europe/Podgorica",                latitude:  42.7087, longitude:   19.3744 },
  { code: "MS", name: "Montserrat",                       phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/Montserrat",              latitude:  16.7425, longitude:  -62.1874 },
  { code: "MA", name: "Morocco",                          phoneCode: "+212",  currencyCode: "MAD", timezoneDefault: "Africa/Casablanca",               latitude:  31.7917, longitude:   -7.0926 },
  { code: "MZ", name: "Mozambique",                       phoneCode: "+258",  currencyCode: "MZN", timezoneDefault: "Africa/Maputo",                   latitude: -18.6657, longitude:   35.5296 },
  { code: "MM", name: "Myanmar",                          phoneCode: "+95",   currencyCode: "MMK", timezoneDefault: "Asia/Rangoon",                    latitude:  21.9162, longitude:   95.9560 },

  // ── N ─────────────────────────────────────────────────────────────────────
  { code: "NA", name: "Namibia",                          phoneCode: "+264",  currencyCode: "NAD", timezoneDefault: "Africa/Windhoek",                 latitude: -22.9576, longitude:   18.4904 },
  { code: "NR", name: "Nauru",                            phoneCode: "+674",  currencyCode: "AUD", timezoneDefault: "Pacific/Nauru",                   latitude:  -0.5228, longitude:  166.9315 },
  { code: "NP", name: "Nepal",                            phoneCode: "+977",  currencyCode: "NPR", timezoneDefault: "Asia/Kathmandu",                  latitude:  28.3949, longitude:   84.1240 },
  { code: "NL", name: "Netherlands",                      phoneCode: "+31",   currencyCode: "EUR", timezoneDefault: "Europe/Amsterdam",                latitude:  52.1326, longitude:    5.2913 },
  { code: "NC", name: "New Caledonia",                    phoneCode: "+687",  currencyCode: "XPF", timezoneDefault: "Pacific/Noumea",                  latitude: -20.9043, longitude:  165.6180 },
  { code: "NZ", name: "New Zealand",                      phoneCode: "+64",   currencyCode: "NZD", timezoneDefault: "Pacific/Auckland",                latitude: -40.9006, longitude:  174.8860 },
  { code: "NI", name: "Nicaragua",                        phoneCode: "+505",  currencyCode: "NIO", timezoneDefault: "America/Managua",                 latitude:  12.8654, longitude:  -85.2072 },
  { code: "NE", name: "Niger",                            phoneCode: "+227",  currencyCode: "XOF", timezoneDefault: "Africa/Niamey",                   latitude:  17.6078, longitude:    8.0817 },
  { code: "NG", name: "Nigeria",                          phoneCode: "+234",  currencyCode: "NGN", timezoneDefault: "Africa/Lagos",                    latitude:   9.0820, longitude:    8.6753 },
  { code: "NU", name: "Niue",                             phoneCode: "+683",  currencyCode: "NZD", timezoneDefault: "Pacific/Niue",                    latitude: -19.0544, longitude: -169.8672 },
  { code: "NF", name: "Norfolk Island",                   phoneCode: "+672",  currencyCode: "AUD", timezoneDefault: "Pacific/Norfolk",                 latitude: -29.0408, longitude:  167.9547 },
  { code: "MP", name: "Northern Mariana Islands",         phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "Pacific/Saipan",                  latitude:  15.0979, longitude:  145.6739 },
  { code: "MK", name: "North Macedonia",                  phoneCode: "+389",  currencyCode: "MKD", timezoneDefault: "Europe/Skopje",                   latitude:  41.6086, longitude:   21.7453 },
  { code: "NO", name: "Norway",                           phoneCode: "+47",   currencyCode: "NOK", timezoneDefault: "Europe/Oslo",                     latitude:  60.4720, longitude:    8.4689 },

  // ── O ─────────────────────────────────────────────────────────────────────
  { code: "OM", name: "Oman",                             phoneCode: "+968",  currencyCode: "OMR", timezoneDefault: "Asia/Muscat",                     latitude:  21.4735, longitude:   55.9754 },

  // ── P ─────────────────────────────────────────────────────────────────────
  { code: "PK", name: "Pakistan",                         phoneCode: "+92",   currencyCode: "PKR", timezoneDefault: "Asia/Karachi",                    latitude:  30.3753, longitude:   69.3451 },
  { code: "PW", name: "Palau",                            phoneCode: "+680",  currencyCode: "USD", timezoneDefault: "Pacific/Palau",                   latitude:   7.5150, longitude:  134.5825 },
  { code: "PS", name: "Palestine",                        phoneCode: "+970",  currencyCode: "ILS", timezoneDefault: "Asia/Gaza",                       latitude:  31.9522, longitude:   35.2332 },
  { code: "PA", name: "Panama",                           phoneCode: "+507",  currencyCode: "PAB", timezoneDefault: "America/Panama",                  latitude:   8.5380, longitude:  -80.7821 },
  { code: "PG", name: "Papua New Guinea",                 phoneCode: "+675",  currencyCode: "PGK", timezoneDefault: "Pacific/Port_Moresby",            latitude:  -6.3150, longitude:  143.9555 },
  { code: "PY", name: "Paraguay",                         phoneCode: "+595",  currencyCode: "PYG", timezoneDefault: "America/Asuncion",                latitude: -23.4425, longitude:  -58.4438 },
  { code: "PE", name: "Peru",                             phoneCode: "+51",   currencyCode: "PEN", timezoneDefault: "America/Lima",                    latitude:  -9.1900, longitude:  -75.0152 },
  { code: "PH", name: "Philippines",                      phoneCode: "+63",   currencyCode: "PHP", timezoneDefault: "Asia/Manila",                     latitude:  12.8797, longitude:  121.7740 },
  { code: "PN", name: "Pitcairn",                         phoneCode: "+64",   currencyCode: "NZD", timezoneDefault: "Pacific/Pitcairn",                latitude: -24.3768, longitude: -128.3242 },
  { code: "PL", name: "Poland",                           phoneCode: "+48",   currencyCode: "PLN", timezoneDefault: "Europe/Warsaw",                   latitude:  51.9194, longitude:   19.1451 },
  { code: "PT", name: "Portugal",                         phoneCode: "+351",  currencyCode: "EUR", timezoneDefault: "Europe/Lisbon",                   latitude:  39.3999, longitude:   -8.2245 },
  { code: "PR", name: "Puerto Rico",                      phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "America/Puerto_Rico",             latitude:  18.2208, longitude:  -66.5901 },

  // ── Q ─────────────────────────────────────────────────────────────────────
  { code: "QA", name: "Qatar",                            phoneCode: "+974",  currencyCode: "QAR", timezoneDefault: "Asia/Qatar",                      latitude:  25.3548, longitude:   51.1839 },

  // ── R ─────────────────────────────────────────────────────────────────────
  { code: "RE", name: "Réunion",                          phoneCode: "+262",  currencyCode: "EUR", timezoneDefault: "Indian/Reunion",                  latitude: -21.1151, longitude:   55.5364 },
  { code: "RO", name: "Romania",                          phoneCode: "+40",   currencyCode: "RON", timezoneDefault: "Europe/Bucharest",                latitude:  45.9432, longitude:   24.9668 },
  { code: "RU", name: "Russia",                           phoneCode: "+7",    currencyCode: "RUB", timezoneDefault: "Europe/Moscow",                   latitude:  61.5240, longitude:  105.3188 },
  { code: "RW", name: "Rwanda",                           phoneCode: "+250",  currencyCode: "RWF", timezoneDefault: "Africa/Kigali",                   latitude:  -1.9403, longitude:   29.8739 },

  // ── S ─────────────────────────────────────────────────────────────────────
  { code: "BL", name: "Saint Barthélemy",                 phoneCode: "+590",  currencyCode: "EUR", timezoneDefault: "America/St_Barthelemy",           latitude:  17.9000, longitude:  -62.8333 },
  { code: "SH", name: "Saint Helena",                     phoneCode: "+290",  currencyCode: "SHP", timezoneDefault: "Atlantic/St_Helena",              latitude: -15.9650, longitude:   -5.7089 },
  { code: "KN", name: "Saint Kitts and Nevis",            phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/St_Kitts",                latitude:  17.3578, longitude:  -62.7830 },
  { code: "LC", name: "Saint Lucia",                      phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/St_Lucia",                latitude:  13.9094, longitude:  -60.9789 },
  { code: "MF", name: "Saint Martin (French)",            phoneCode: "+590",  currencyCode: "EUR", timezoneDefault: "America/Marigot",                 latitude:  18.0708, longitude:  -63.0501 },
  { code: "PM", name: "Saint Pierre and Miquelon",        phoneCode: "+508",  currencyCode: "EUR", timezoneDefault: "America/Miquelon",                latitude:  46.8852, longitude:  -56.3159 },
  { code: "VC", name: "Saint Vincent and the Grenadines", phoneCode: "+1",    currencyCode: "XCD", timezoneDefault: "America/St_Vincent",              latitude:  12.9843, longitude:  -61.2872 },
  { code: "WS", name: "Samoa",                            phoneCode: "+685",  currencyCode: "WST", timezoneDefault: "Pacific/Apia",                    latitude: -13.7590, longitude: -172.1046 },
  { code: "SM", name: "San Marino",                       phoneCode: "+378",  currencyCode: "EUR", timezoneDefault: "Europe/San_Marino",               latitude:  43.9424, longitude:   12.4578 },
  { code: "ST", name: "São Tomé and Príncipe",            phoneCode: "+239",  currencyCode: "STN", timezoneDefault: "Africa/Sao_Tome",                 latitude:   0.1864, longitude:    6.6131 },
  { code: "SA", name: "Saudi Arabia",                     phoneCode: "+966",  currencyCode: "SAR", timezoneDefault: "Asia/Riyadh",                     latitude:  23.8859, longitude:   45.0792 },
  { code: "SN", name: "Senegal",                          phoneCode: "+221",  currencyCode: "XOF", timezoneDefault: "Africa/Dakar",                    latitude:  14.4974, longitude:  -14.4524 },
  { code: "RS", name: "Serbia",                           phoneCode: "+381",  currencyCode: "RSD", timezoneDefault: "Europe/Belgrade",                 latitude:  44.0165, longitude:   21.0059 },
  { code: "SC", name: "Seychelles",                       phoneCode: "+248",  currencyCode: "SCR", timezoneDefault: "Indian/Mahe",                     latitude:  -4.6796, longitude:   55.4920 },
  { code: "SL", name: "Sierra Leone",                     phoneCode: "+232",  currencyCode: "SLL", timezoneDefault: "Africa/Freetown",                 latitude:   8.4606, longitude:  -11.7799 },
  { code: "SG", name: "Singapore",                        phoneCode: "+65",   currencyCode: "SGD", timezoneDefault: "Asia/Singapore",                  latitude:   1.3521, longitude:  103.8198 },
  { code: "SX", name: "Sint Maarten (Dutch)",             phoneCode: "+1",    currencyCode: "ANG", timezoneDefault: "America/Lower_Princes",           latitude:  18.0347, longitude:  -63.0681 },
  { code: "SK", name: "Slovakia",                         phoneCode: "+421",  currencyCode: "EUR", timezoneDefault: "Europe/Bratislava",               latitude:  48.6690, longitude:   19.6990 },
  { code: "SI", name: "Slovenia",                         phoneCode: "+386",  currencyCode: "EUR", timezoneDefault: "Europe/Ljubljana",                latitude:  46.1512, longitude:   14.9955 },
  { code: "SB", name: "Solomon Islands",                  phoneCode: "+677",  currencyCode: "SBD", timezoneDefault: "Pacific/Guadalcanal",             latitude:  -9.6457, longitude:  160.1562 },
  { code: "SO", name: "Somalia",                          phoneCode: "+252",  currencyCode: "SOS", timezoneDefault: "Africa/Mogadishu",                latitude:   5.1521, longitude:   46.1996 },
  { code: "ZA", name: "South Africa",                     phoneCode: "+27",   currencyCode: "ZAR", timezoneDefault: "Africa/Johannesburg",             latitude: -30.5595, longitude:   22.9375 },
  { code: "GS", name: "South Georgia and S. Sandwich Is.",phoneCode: "+500",  currencyCode: "GBP", timezoneDefault: "Atlantic/South_Georgia",          latitude: -54.4296, longitude:  -36.5879 },
  { code: "SS", name: "South Sudan",                      phoneCode: "+211",  currencyCode: "SSP", timezoneDefault: "Africa/Juba",                     latitude:   6.8770, longitude:   31.3069 },
  { code: "ES", name: "Spain",                            phoneCode: "+34",   currencyCode: "EUR", timezoneDefault: "Europe/Madrid",                   latitude:  40.4637, longitude:   -3.7492 },
  { code: "LK", name: "Sri Lanka",                        phoneCode: "+94",   currencyCode: "LKR", timezoneDefault: "Asia/Colombo",                    latitude:   7.8731, longitude:   80.7718 },
  { code: "SD", name: "Sudan",                            phoneCode: "+249",  currencyCode: "SDG", timezoneDefault: "Africa/Khartoum",                 latitude:  12.8628, longitude:   30.2176 },
  { code: "SR", name: "Suriname",                         phoneCode: "+597",  currencyCode: "SRD", timezoneDefault: "America/Paramaribo",              latitude:   3.9193, longitude:  -56.0278 },
  { code: "SJ", name: "Svalbard and Jan Mayen",           phoneCode: "+47",   currencyCode: "NOK", timezoneDefault: "Arctic/Longyearbyen",             latitude:  77.5536, longitude:   23.6703 },
  { code: "SE", name: "Sweden",                           phoneCode: "+46",   currencyCode: "SEK", timezoneDefault: "Europe/Stockholm",                latitude:  60.1282, longitude:   18.6435 },
  { code: "CH", name: "Switzerland",                      phoneCode: "+41",   currencyCode: "CHF", timezoneDefault: "Europe/Zurich",                   latitude:  46.8182, longitude:    8.2275 },
  { code: "SY", name: "Syria",                            phoneCode: "+963",  currencyCode: "SYP", timezoneDefault: "Asia/Damascus",                   latitude:  34.8021, longitude:   38.9968 },

  // ── T ─────────────────────────────────────────────────────────────────────
  { code: "TW", name: "Taiwan",                           phoneCode: "+886",  currencyCode: "TWD", timezoneDefault: "Asia/Taipei",                     latitude:  23.5937, longitude:  121.0254 },
  { code: "TJ", name: "Tajikistan",                       phoneCode: "+992",  currencyCode: "TJS", timezoneDefault: "Asia/Dushanbe",                   latitude:  38.8610, longitude:   71.2761 },
  { code: "TZ", name: "Tanzania",                         phoneCode: "+255",  currencyCode: "TZS", timezoneDefault: "Africa/Dar_es_Salaam",            latitude:  -6.3690, longitude:   34.8888 },
  { code: "TH", name: "Thailand",                         phoneCode: "+66",   currencyCode: "THB", timezoneDefault: "Asia/Bangkok",                    latitude:  15.8700, longitude:  100.9925 },
  { code: "TL", name: "Timor-Leste",                      phoneCode: "+670",  currencyCode: "USD", timezoneDefault: "Asia/Dili",                       latitude:  -8.8742, longitude:  125.7275 },
  { code: "TG", name: "Togo",                             phoneCode: "+228",  currencyCode: "XOF", timezoneDefault: "Africa/Lome",                     latitude:   8.6195, longitude:    0.8248 },
  { code: "TK", name: "Tokelau",                          phoneCode: "+690",  currencyCode: "NZD", timezoneDefault: "Pacific/Fakaofo",                 latitude:  -9.2000, longitude: -171.8484 },
  { code: "TO", name: "Tonga",                            phoneCode: "+676",  currencyCode: "TOP", timezoneDefault: "Pacific/Tongatapu",               latitude: -21.1789, longitude: -175.1982 },
  { code: "TT", name: "Trinidad and Tobago",              phoneCode: "+1",    currencyCode: "TTD", timezoneDefault: "America/Port_of_Spain",           latitude:  10.6918, longitude:  -61.2225 },
  { code: "TN", name: "Tunisia",                          phoneCode: "+216",  currencyCode: "TND", timezoneDefault: "Africa/Tunis",                    latitude:  33.8869, longitude:    9.5375 },
  { code: "TR", name: "Turkey",                           phoneCode: "+90",   currencyCode: "TRY", timezoneDefault: "Europe/Istanbul",                 latitude:  38.9637, longitude:   35.2433 },
  { code: "TM", name: "Turkmenistan",                     phoneCode: "+993",  currencyCode: "TMT", timezoneDefault: "Asia/Ashgabat",                   latitude:  38.9697, longitude:   59.5563 },
  { code: "TC", name: "Turks and Caicos Islands",         phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "America/Grand_Turk",              latitude:  21.6940, longitude:  -71.7979 },
  { code: "TV", name: "Tuvalu",                           phoneCode: "+688",  currencyCode: "AUD", timezoneDefault: "Pacific/Funafuti",                latitude:  -7.1095, longitude:  177.6493 },

  // ── U ─────────────────────────────────────────────────────────────────────
  { code: "UG", name: "Uganda",                           phoneCode: "+256",  currencyCode: "UGX", timezoneDefault: "Africa/Kampala",                  latitude:   1.3733, longitude:   32.2903 },
  { code: "UA", name: "Ukraine",                          phoneCode: "+380",  currencyCode: "UAH", timezoneDefault: "Europe/Kiev",                     latitude:  48.3794, longitude:   31.1656 },
  { code: "AE", name: "United Arab Emirates",             phoneCode: "+971",  currencyCode: "AED", timezoneDefault: "Asia/Dubai",                      latitude:  23.4241, longitude:   53.8478 },
  { code: "GB", name: "United Kingdom",                   phoneCode: "+44",   currencyCode: "GBP", timezoneDefault: "Europe/London",                   latitude:  55.3781, longitude:   -3.4360 },
  { code: "UM", name: "US Minor Outlying Islands",        phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "Pacific/Wake",                    latitude:  19.2823, longitude:  166.6470 },
  { code: "US", name: "United States",                    phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "America/New_York",                latitude:  37.0902, longitude:  -95.7129 },
  { code: "UY", name: "Uruguay",                          phoneCode: "+598",  currencyCode: "UYU", timezoneDefault: "America/Montevideo",              latitude: -32.5228, longitude:  -55.7658 },
  { code: "UZ", name: "Uzbekistan",                       phoneCode: "+998",  currencyCode: "UZS", timezoneDefault: "Asia/Tashkent",                   latitude:  41.3775, longitude:   64.5853 },

  // ── V ─────────────────────────────────────────────────────────────────────
  { code: "VU", name: "Vanuatu",                          phoneCode: "+678",  currencyCode: "VUV", timezoneDefault: "Pacific/Efate",                   latitude: -15.3767, longitude:  166.9592 },
  { code: "VE", name: "Venezuela",                        phoneCode: "+58",   currencyCode: "VES", timezoneDefault: "America/Caracas",                 latitude:   6.4238, longitude:  -66.5897 },
  { code: "VN", name: "Vietnam",                          phoneCode: "+84",   currencyCode: "VND", timezoneDefault: "Asia/Ho_Chi_Minh",                latitude:  14.0583, longitude:  108.2772 },
  { code: "VG", name: "Virgin Islands (British)",         phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "America/Tortola",                 latitude:  18.4207, longitude:  -64.6400 },
  { code: "VI", name: "Virgin Islands (US)",              phoneCode: "+1",    currencyCode: "USD", timezoneDefault: "America/St_Thomas",               latitude:  18.3358, longitude:  -64.8963 },

  // ── W ─────────────────────────────────────────────────────────────────────
  { code: "WF", name: "Wallis and Futuna",                phoneCode: "+681",  currencyCode: "XPF", timezoneDefault: "Pacific/Wallis",                  latitude: -13.7687, longitude: -177.1561 },
  { code: "EH", name: "Western Sahara",                   phoneCode: "+212",  currencyCode: "MAD", timezoneDefault: "Africa/El_Aaiun",                 latitude:  24.2155, longitude:  -12.8858 },

  // ── Y ─────────────────────────────────────────────────────────────────────
  { code: "YE", name: "Yemen",                            phoneCode: "+967",  currencyCode: "YER", timezoneDefault: "Asia/Aden",                       latitude:  15.5527, longitude:   48.5164 },

  // ── Z ─────────────────────────────────────────────────────────────────────
  { code: "ZM", name: "Zambia",                           phoneCode: "+260",  currencyCode: "ZMW", timezoneDefault: "Africa/Lusaka",                   latitude: -13.1339, longitude:   27.8493 },
  { code: "ZW", name: "Zimbabwe",                         phoneCode: "+263",  currencyCode: "ZWL", timezoneDefault: "Africa/Harare",                   latitude: -19.0154, longitude:   29.1549 },
];
