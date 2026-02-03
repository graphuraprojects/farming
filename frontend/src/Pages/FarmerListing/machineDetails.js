const machinesDetails = [
  {
    id: "1",
    name: "John Deere 8R 370",
    model: "2022",
    pricePerDay: 150,
    transportFee: 50,
    serviceFee: 20,
    operatorFeePerDay: 350,
    rating: 4.9,
    reviews: 12,
    location: "Des Moines, Iowa",
    available: true,
    host: "AgriCorp Rentals",
    join: "2019",
    responseRate: 100,
    specs: {
      power: "410 HP",
      fuel: "Diesel",
      drive: "4WD / MFWD",
      weight: "14,000 kg",
      hours: "450 hrs",
      hitch: "Cat 4N/3",
    },
    description: [
      "The John Deere 8R 410 is built to excel in the field and on the road, delivering the power and comfort you need for maximum productivity. This 2022 model has been meticulously maintained by AgriCorp Rentals and comes equipped with the Signature Edition package.",
      "Key features include the CommandPRO™ joystick for seamless control, ActiveSeat™ II for all-day comfort, and integrated StarFire™ 6000 Receiver for precision agriculture tasks. Ideal for heavy tillage, planting, and seeding operations.",
      "This unit includes a full service history and recently underwent a 500-hour comprehensive inspection. Tires are at 90% tread life.",
    ],
     
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXMm6GAptYeTKY2FlyxBP1l38Wmp77sWpaJXv3No4nO0WGgZIHwap3GxC8h16dGSzcIRQ6OeuAmLzhguUjKtXFeBUc41WuaClXwKW_jUp8MwzSuhElacGt_ZEhZxVRMEuY-JcsW-wYtkXu82qV_tkLkR5EvOo6lpACO59aZkyeinpIcHjY-n8Z-HffmX9JpkwC1vy35WM6aOZsSJlVSybSfYuBvJO5SIj-HsxqssMOWCKGUvDMDFOMfOvo9Nl3cOK97EBcbQLRoCq3",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9MNWPBQwBNUSdHFtMwSXstqlUA-2wwcw6UyeDGxcV6ZH0sFEXVwx40waTNyc9Z6CqCVPgSoehnEPpwlu8ffjnoQ7TaNWJO4YURlDMUoZJMtygFOVcXKrMHvx1K1wvuJ1GX--MUigzLV1V9RzOGrywttH7uLUJOfK9ik5MhYZRBYWi0fycFBaOJ7DOaOp3Mwbbh71OO2TaG5FK0yZ3F-iqAnKJaOMPAqxHH3zuGlRCL4vqcRsrAEUfYCnOR3hMzrxhxEVbBEvIrwv7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC86VFjcYckth--2a57DlSsAD9cy0r3WDHhKePlzfN_yHYWNRygBAB8M8DjySepKoQE6REDQLCbRBPJsBrmCM89hdrksJOF4UUfOwnv0mhgTAShFlSisvIUwNragfN_EmhmJWW2Qvf70LucbfMtfCNXO4rzQfzo-CbScW3l21CDSuJS3ozE-5HGFt3ib9U7OO4253Lsg9i5zGuSHtSr4iIOptNePzmTG1lJhJy2dNUn8wuXmfcQ8iOFTzEnlyqU6Gt62fNdmHKFRGaq",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUUSVOUHs9NgDQkb5svB6l6t-BvYZ2fmM-Jo89T3iMsMd47BHR9YNdaT8Gh7oMn2SOp8srtN6dzccrzxpLiKJX3PhjYyNg7ABDTXslHVGUSN2z6iqJ4ArqmxmXTdl2goh6dGkwDxTVflRbwg7dMHkmDFqssc8L7IkR6O1fn9mtpTapALvY__yLyZpTOKbpKlSJZg_Jvioq22r_Njl-PZ9pVpc-wTZvs1kxg3NA0C3dr2BBz8J77JraYLh4_semIcQql8gX7U9RmiK",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsC0UlV2mjhAKrt5zQthmkt-gOn_cdzfV80sJZ7eg0s_JdYRWMeJ9y6lyWGXhxIB_ELI3XMSCGtFYS_VSiEcYNrAfXtvgjzS0IIy1TjQtwd2-5PiJ3U_S3bha9bCF_QAsBRiGm4OQJsamhkAAqfslhH7RJNetENCpMzoxxmXER9WADDIQcyFcezJ2psGhHxUCE7yKQSYwie0vXhxbZyU1i4IfhBkv8wdbxp-7eHVdGnQkj7hWx-9De_wtVMBx6nJbdN68pIH25bBgW"
    ],
  },
  {
    id: "2",
    name: "Case IH Axial-Flow 250",
    model: "2022",
    pricePerDay: 150,
    transportFee: 50,
    serviceFee: 20,
    operatorFeePerDay: 350,
    rating: 4.9,
    reviews: 12,
    location: "Des Moines, Iowa",
    available: true,
    host: "AgriCorp Rentals",
    join: "2019",
    responseRate: 100,
    specs: {
      power: "410 HP",
      fuel: "Diesel",
      drive: "4WD / MFWD",
      weight: "14,000 kg",
      hours: "450 hrs",
      hitch: "Cat 4N/3",
    },
    description: [
      "The John Deere 8R 410 is built to excel in the field and on the road, delivering the power and comfort you need for maximum productivity. This 2022 model has been meticulously maintained by AgriCorp Rentals and comes equipped with the Signature Edition package.",
      "Key features include the CommandPRO™ joystick for seamless control, ActiveSeat™ II for all-day comfort, and integrated StarFire™ 6000 Receiver for precision agriculture tasks. Ideal for heavy tillage, planting, and seeding operations.",
      "This unit includes a full service history and recently underwent a 500-hour comprehensive inspection. Tires are at 90% tread life.",
    ],
     
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXMm6GAptYeTKY2FlyxBP1l38Wmp77sWpaJXv3No4nO0WGgZIHwap3GxC8h16dGSzcIRQ6OeuAmLzhguUjKtXFeBUc41WuaClXwKW_jUp8MwzSuhElacGt_ZEhZxVRMEuY-JcsW-wYtkXu82qV_tkLkR5EvOo6lpACO59aZkyeinpIcHjY-n8Z-HffmX9JpkwC1vy35WM6aOZsSJlVSybSfYuBvJO5SIj-HsxqssMOWCKGUvDMDFOMfOvo9Nl3cOK97EBcbQLRoCq3",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9MNWPBQwBNUSdHFtMwSXstqlUA-2wwcw6UyeDGxcV6ZH0sFEXVwx40waTNyc9Z6CqCVPgSoehnEPpwlu8ffjnoQ7TaNWJO4YURlDMUoZJMtygFOVcXKrMHvx1K1wvuJ1GX--MUigzLV1V9RzOGrywttH7uLUJOfK9ik5MhYZRBYWi0fycFBaOJ7DOaOp3Mwbbh71OO2TaG5FK0yZ3F-iqAnKJaOMPAqxHH3zuGlRCL4vqcRsrAEUfYCnOR3hMzrxhxEVbBEvIrwv7",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC86VFjcYckth--2a57DlSsAD9cy0r3WDHhKePlzfN_yHYWNRygBAB8M8DjySepKoQE6REDQLCbRBPJsBrmCM89hdrksJOF4UUfOwnv0mhgTAShFlSisvIUwNragfN_EmhmJWW2Qvf70LucbfMtfCNXO4rzQfzo-CbScW3l21CDSuJS3ozE-5HGFt3ib9U7OO4253Lsg9i5zGuSHtSr4iIOptNePzmTG1lJhJy2dNUn8wuXmfcQ8iOFTzEnlyqU6Gt62fNdmHKFRGaq",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNUUSVOUHs9NgDQkb5svB6l6t-BvYZ2fmM-Jo89T3iMsMd47BHR9YNdaT8Gh7oMn2SOp8srtN6dzccrzxpLiKJX3PhjYyNg7ABDTXslHVGUSN2z6iqJ4ArqmxmXTdl2goh6dGkwDxTVflRbwg7dMHkmDFqssc8L7IkR6O1fn9mtpTapALvY__yLyZpTOKbpKlSJZg_Jvioq22r_Njl-PZ9pVpc-wTZvs1kxg3NA0C3dr2BBz8J77JraYLh4_semIcQql8gX7U9RmiK",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsC0UlV2mjhAKrt5zQthmkt-gOn_cdzfV80sJZ7eg0s_JdYRWMeJ9y6lyWGXhxIB_ELI3XMSCGtFYS_VSiEcYNrAfXtvgjzS0IIy1TjQtwd2-5PiJ3U_S3bha9bCF_QAsBRiGm4OQJsamhkAAqfslhH7RJNetENCpMzoxxmXER9WADDIQcyFcezJ2psGhHxUCE7yKQSYwie0vXhxbZyU1i4IfhBkv8wdbxp-7eHVdGnQkj7hWx-9De_wtVMBx6nJbdN68pIH25bBgW"
    ],
  },
];


export default machinesDetails;