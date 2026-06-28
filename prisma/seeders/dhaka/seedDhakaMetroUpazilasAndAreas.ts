import { PrismaClient } from '@prisma/client';

export async function seedDhakaMetroUpazilasAndAreas(prisma: PrismaClient) {
  // Find Dhaka district
  const dhakaDistrict = await prisma.bdDistrict.findFirst({
    where: { code: 'DIS-47' }, // Dhaka district code is DIS-47
  });

  if (!dhakaDistrict) {
    console.warn('⚠️ Dhaka district with code DIS-47 not found. Skipping metro upazilas seed.');
    return;
  }

  const districtId = dhakaDistrict.id;

  const metroThanas = [
    { code: 'UPA-METRO-UTTARA', nameEn: 'Uttara', nameBn: 'উত্তরা', areaPrefixes: ['AREA-DNCC-UTTARA-'] },
    { code: 'UPA-METRO-AIRPORT', nameEn: 'Airport / Kawla', nameBn: 'এয়ারপোর্ট / কাওলা', areaPrefixes: ['AREA-DNCC-AIRPORT-'] },
    { code: 'UPA-METRO-DAKKHINKHAN', nameEn: 'Dakshinkhan', nameBn: 'দক্ষিণখান', areaPrefixes: ['AREA-DNCC-DAKKHINKHAN-'] },
    { code: 'UPA-METRO-UTTARKHAN', nameEn: 'Uttarkhan', nameBn: 'উত্তরখান', areaPrefixes: ['AREA-DNCC-UTTARKHAN-'] },
    { code: 'UPA-METRO-KHILKHET', nameEn: 'Khilkhet', nameBn: 'খিলক্ষেত', areaPrefixes: ['AREA-DNCC-KHILKHET-'] },
    { code: 'UPA-METRO-BADDA', nameEn: 'Badda', nameBn: 'বাড্ডা', areaPrefixes: ['AREA-DNCC-BADDA-'] },
    { code: 'UPA-METRO-GULSHAN', nameEn: 'Gulshan / Banani / Baridhara', nameBn: 'গুলশান / বনানী / বারিধারা', areaPrefixes: ['AREA-DNCC-GULSHAN-'] },
    { code: 'UPA-METRO-TEJGAON', nameEn: 'Tejgaon / Farmgate', nameBn: 'তেজগাঁও / ফার্মগেট', areaPrefixes: ['AREA-DNCC-TEJGAON-'] },
    { code: 'UPA-METRO-MOHAMMADPUR', nameEn: 'Mohammadpur / Adabor', nameBn: 'মোহাম্মদপুর / আদাবর', areaPrefixes: ['AREA-DNCC-MOHAMMADPUR-'] },
    { code: 'UPA-METRO-SHER_E_BANGLA_NAGAR', nameEn: 'Sher-e-Bangla Nagar / Agargaon', nameBn: 'শেরেবাংলা নগর / আগারগাঁও', areaPrefixes: ['AREA-DNCC-SHER_E_BANGLA_NAGAR-'] },
    { code: 'UPA-METRO-MIRPUR', nameEn: 'Mirpur', nameBn: 'মিরপুর', areaPrefixes: ['AREA-DNCC-MIRPUR-'] },
    { code: 'UPA-METRO-PALLABI', nameEn: 'Pallabi / ECB', nameBn: 'পল্লবী / ইসিবি', areaPrefixes: ['AREA-DNCC-PALLABI-'] },
    { code: 'UPA-METRO-KAFRUL', nameEn: 'Kafrul / Cantonment', nameBn: 'কাফরুল / ক্যান্টনমেন্ট', areaPrefixes: ['AREA-DNCC-KAFRUL-'] },
    
    { code: 'UPA-METRO-DHANMONDI', nameEn: 'Dhanmondi / Kalabagan', nameBn: 'ধানমন্ডি / কলাবাগান', areaPrefixes: ['AREA-DSCC-DHANMONDI-'] },
    { code: 'UPA-METRO-NEWMARKET', nameEn: 'New Market / Azimpur', nameBn: 'নিউ মার্কেট / আজিমপুর', areaPrefixes: ['AREA-DSCC-NEW_MARKET-'] },
    { code: 'UPA-METRO-RAMNA', nameEn: 'Ramna / Shahbag', nameBn: 'রমনা / শাহবাগ', areaPrefixes: ['AREA-DSCC-RAMNA-'] },
    { code: 'UPA-METRO-PALTAN', nameEn: 'Paltan / Kakrail', nameBn: 'পল্টন / কাকরাইল', areaPrefixes: ['AREA-DSCC-PALTAN-'] },
    { code: 'UPA-METRO-MOTIJHEEL', nameEn: 'Motijheel / Kamalapur', nameBn: 'মতিঝিল / কমলাপুর', areaPrefixes: ['AREA-DSCC-MOTIJHEEL-'] },
    { code: 'UPA-METRO-KHILGAON', nameEn: 'Khilgaon / Malibagh', nameBn: 'খিলগাঁও / মালিবাগ', areaPrefixes: ['AREA-DSCC-KHILGAON-'] },
    { code: 'UPA-METRO-RAMPURA', nameEn: 'Rampura / Banasree', nameBn: 'রামপুরা / বনশ্রী', areaPrefixes: ['AREA-DSCC-RAMPURA-'] },
    { code: 'UPA-METRO-BASHABO', nameEn: 'Basabo / Sabujbagh', nameBn: 'বাসাবো / সবুজবাগ', areaPrefixes: ['AREA-DSCC-BASHABO-'] },
    { code: 'UPA-METRO-JATRABARI', nameEn: 'Jatrabari / Dhania / Donia', nameBn: 'যাত্রাবাড়ী / ধানিয়া / ডনিয়া', areaPrefixes: ['AREA-DSCC-JATRABARI-'] },
    { code: 'UPA-METRO-DEMRA', nameEn: 'Demra / Matuail', nameBn: 'ডেমরা / মাতুয়াইল', areaPrefixes: ['AREA-DSCC-DEMRA-'] },
    { code: 'UPA-METRO-SHYAMPUR', nameEn: 'Shyampur / Jurain', nameBn: 'শ্যামপুর / জুরাইন', areaPrefixes: ['AREA-DSCC-SHYAMPUR-'] },
    { code: 'UPA-METRO-OLD_DHAKA', nameEn: 'Old Dhaka (Kotwali / Sutrapur)', nameBn: 'পুরান ঢাকা (কোতোয়ালি / সূত্রাপুর)', areaPrefixes: ['AREA-DSCC-OLD_DHAKA-'] },
    { code: 'UPA-METRO-LALBAGH', nameEn: 'Lalbagh / Kamrangirchar', nameBn: 'লালবাগ / কামরাঙ্গীরচর', areaPrefixes: ['AREA-DSCC-LALBAGH-'] },
    { code: 'UPA-METRO-HAZARIBAGH', nameEn: 'Hazaribagh / Rayerbazar', nameBn: 'হাজারীবাগ / রায়েরবাজার', areaPrefixes: ['AREA-DSCC-HAZARIBAGH-'] },
  ];

  for (const thana of metroThanas) {
    const upazila = await prisma.bdUpazila.upsert({
      where: { code: thana.code },
      update: {
        nameEn: thana.nameEn,
        nameBn: thana.nameBn,
        districtId,
      },
      create: {
        code: thana.code,
        nameEn: thana.nameEn,
        nameBn: thana.nameBn,
        districtId,
      },
    });

    // Update matching BdArea records to point to this upazilaId
    for (const prefix of thana.areaPrefixes) {
      await prisma.bdArea.updateMany({
        where: {
          code: { startsWith: prefix },
          districtId,
        },
        data: {
          upazilaId: upazila.id,
        },
      });
    }
  }

  console.log(`✅ Seeded ${metroThanas.length} Dhaka metro upazilas and linked their areas successfully.`);
}
