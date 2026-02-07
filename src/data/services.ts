import { 
  Camera, 
  Sun, 
  Lightbulb, 
  Zap,
  DoorOpen,
  Fence,
  Car,
  Satellite,
  PaintBucket,
  Grid3X3,
  Wrench,
  Lamp,
  Home,
  Lock,
  LucideIcon
} from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  category: string;
  heroDescription: string;
  whatWeDo: string[];
  benefits: string[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const services: Service[] = [
  {
    slug: "smart-security",
    title: "Smart Security",
    shortDescription: "CCTV installation with integrated cameras and sensors",
    icon: Camera,
    category: "Security",
    heroDescription: "Protect your property with professional CCTV installation featuring integrated cameras, motion sensors, and 24/7 monitoring capabilities.",
    whatWeDo: [
      "Professional CCTV camera installation and configuration",
      "Motion sensor integration with alarm systems",
      "Remote monitoring setup via smartphone apps",
      "Night vision and infrared camera systems",
      "Video storage solutions (local and cloud)",
      "Maintenance and system upgrades"
    ],
    benefits: [
      "24/7 property surveillance and peace of mind",
      "Deter criminal activity with visible security",
      "Remote access to live feeds from anywhere",
      "Evidence collection for incidents",
      "Reduced insurance premiums",
      "Integration with other smart home systems"
    ],
    faqs: [
      { question: "How many cameras do I need for my property?", answer: "The number depends on your property size and layout. We conduct a free survey to recommend optimal camera placement for complete coverage." },
      { question: "Can I view my cameras remotely?", answer: "Yes, we set up mobile apps so you can view live feeds and recordings from anywhere with internet access." },
      { question: "How long is video footage stored?", answer: "Storage duration depends on your system capacity. We offer solutions ranging from 7 days to several months of recording." },
      { question: "Do you provide maintenance services?", answer: "Yes, we offer ongoing maintenance packages to ensure your system operates optimally year-round." },
      { question: "Are the cameras weatherproof?", answer: "We install outdoor-rated cameras designed to withstand rain, dust, and extreme temperatures." }
    ],
    relatedSlugs: ["electric-fencing", "electronic-gate-installation", "gate-installation"]
  },
  {
    slug: "solar-energy-installation",
    title: "Solar Energy Installation",
    shortDescription: "Green energy solutions with significant cost savings",
    icon: Sun,
    category: "Solar",
    heroDescription: "Harness the power of the sun with professional solar panel installation. Reduce electricity bills and contribute to a sustainable future.",
    whatWeDo: [
      "Solar panel system design and installation",
      "Grid-tied and off-grid solar solutions",
      "Battery storage system integration",
      "Net metering setup and configuration",
      "Solar water heating systems",
      "System monitoring and maintenance"
    ],
    benefits: [
      "Significant reduction in electricity bills",
      "Protection against rising energy costs",
      "Environmentally friendly energy source",
      "Increased property value",
      "Government incentives and tax benefits",
      "Energy independence and reliability"
    ],
    faqs: [
      { question: "How much can I save with solar panels?", answer: "Savings depend on your energy consumption and system size. Most customers see 50-80% reduction in electricity bills." },
      { question: "How long do solar panels last?", answer: "Quality solar panels have a lifespan of 25-30 years with minimal degradation in performance." },
      { question: "What happens during cloudy days?", answer: "Solar panels still generate power on cloudy days, though at reduced capacity. Battery storage ensures continuous supply." },
      { question: "Do you handle permits and approvals?", answer: "Yes, we manage all necessary permits and approvals required for solar installation in your area." },
      { question: "What maintenance is required?", answer: "Solar panels require minimal maintenance—occasional cleaning and annual inspections to ensure optimal performance." },
      { question: "Can I add more panels later?", answer: "Yes, we design systems with scalability in mind, allowing future expansion as your needs grow." }
    ],
    relatedSlugs: ["solar-street-lights", "inverter-installation-repairs", "general-electrical"]
  },
  {
    slug: "solar-street-lights",
    title: "Solar Street Lights",
    shortDescription: "Power the future with sustainable street lighting",
    icon: Lightbulb,
    category: "Solar",
    heroDescription: "Illuminate streets, compounds, and public areas with energy-efficient solar street lights that require no grid connection.",
    whatWeDo: [
      "Solar street light pole installation",
      "LED lighting system integration",
      "Motion sensor and timer configuration",
      "Battery and panel sizing",
      "Estate and compound lighting solutions",
      "Maintenance and lamp replacement"
    ],
    benefits: [
      "Zero electricity costs for lighting",
      "No trenching or cabling required",
      "Automatic dusk-to-dawn operation",
      "Environmentally sustainable solution",
      "Low maintenance requirements",
      "Quick installation with minimal disruption"
    ],
    faqs: [
      { question: "How long do solar street lights stay on?", answer: "Most systems provide 8-12 hours of lighting on a full charge, sufficient for entire nights." },
      { question: "Do they work during rainy season?", answer: "Yes, quality systems store enough energy during day to operate even with reduced sunlight for several days." },
      { question: "What areas can solar street lights cover?", answer: "Each light covers a specific radius depending on pole height and LED wattage. We design for optimal coverage." },
      { question: "How often do batteries need replacement?", answer: "Quality batteries last 3-5 years depending on usage patterns and environmental conditions." },
      { question: "Can they be integrated with motion sensors?", answer: "Yes, motion sensors can be added to increase brightness when movement is detected, conserving energy." }
    ],
    relatedSlugs: ["solar-energy-installation", "general-electrical", "lights-repairs"]
  },
  {
    slug: "inverter-installation-repairs",
    title: "Inverter Installation & Repairs",
    shortDescription: "Design, installation, maintenance & energy audits",
    icon: Zap,
    category: "Inverter",
    heroDescription: "Ensure uninterrupted power supply with professional inverter systems designed for your specific energy needs.",
    whatWeDo: [
      "Inverter system design and sizing",
      "Installation and commissioning",
      "Battery bank setup and configuration",
      "Energy audit and load analysis",
      "Repair and troubleshooting services",
      "Preventive maintenance programs"
    ],
    benefits: [
      "Uninterrupted power during outages",
      "Protection for sensitive electronics",
      "Quiet operation compared to generators",
      "Lower running costs than generators",
      "Automatic power switching",
      "Scalable capacity as needs grow"
    ],
    faqs: [
      { question: "What size inverter do I need?", answer: "Size depends on your power requirements. We conduct energy audits to recommend the optimal capacity for your needs." },
      { question: "How long will battery backup last?", answer: "Backup duration depends on battery capacity and connected load. We design systems to meet your specific runtime requirements." },
      { question: "Can inverters work with solar panels?", answer: "Yes, we install hybrid inverters that integrate seamlessly with solar panel systems for maximum efficiency." },
      { question: "How often should batteries be replaced?", answer: "Quality batteries last 3-5 years with proper maintenance. We provide monitoring to predict replacement timing." },
      { question: "Do you repair all inverter brands?", answer: "Yes, our technicians are trained to diagnose and repair major inverter brands available in Nigeria." },
      { question: "Is installation disruptive to my home/office?", answer: "Installation is typically completed in a day with minimal disruption. We clean up thoroughly after work." }
    ],
    relatedSlugs: ["solar-energy-installation", "general-electrical", "lights-repairs"]
  },
  {
    slug: "electronic-gate-installation",
    title: "Electronic Gate Installation",
    shortDescription: "Professional and reliable gate automation",
    icon: DoorOpen,
    category: "Gates/Fencing",
    heroDescription: "Enhance property access control with automated gate systems featuring remote control, intercom integration, and smart access options.",
    whatWeDo: [
      "Sliding and swing gate automation",
      "Remote control system installation",
      "Intercom and video entry integration",
      "Access control card/code systems",
      "Backup power solutions for gates",
      "Maintenance and motor repairs"
    ],
    benefits: [
      "Convenient remote-controlled access",
      "Enhanced security and access control",
      "Increased property value",
      "Integration with security systems",
      "Weather-resistant components",
      "Visitor management capabilities"
    ],
    faqs: [
      { question: "Can my existing gate be automated?", answer: "In most cases, yes. We assess your current gate structure and recommend the best automation solution." },
      { question: "What happens during power outages?", answer: "Our systems include battery backup for operation during outages, plus manual override options." },
      { question: "How do I let in visitors?", answer: "Options include remote controls, intercom systems, access codes, or smartphone apps depending on your preference." },
      { question: "How often is maintenance needed?", answer: "We recommend quarterly maintenance checks to ensure smooth operation and prevent issues." },
      { question: "Are spare parts readily available?", answer: "We stock common spare parts and can source others quickly to minimize downtime." }
    ],
    relatedSlugs: ["gate-installation", "smart-security", "electric-fencing"]
  },
  {
    slug: "general-electrical",
    title: "General Electrical",
    shortDescription: "Wiring, rewiring, installation and repair services",
    icon: Lamp,
    category: "Electrical",
    heroDescription: "Complete electrical services from new installations to repairs and upgrades, delivered by certified professionals.",
    whatWeDo: [
      "New building electrical installation",
      "Rewiring and electrical upgrades",
      "Circuit breaker and panel installation",
      "Outlet and switch installation",
      "Electrical fault diagnosis and repair",
      "Electrical safety inspections"
    ],
    benefits: [
      "Safe and code-compliant installations",
      "Reduced risk of electrical fires",
      "Improved electrical efficiency",
      "Professional workmanship guarantee",
      "24/7 emergency repair service",
      "Comprehensive safety inspections"
    ],
    faqs: [
      { question: "How do I know if my wiring needs replacing?", answer: "Signs include frequent tripping, flickering lights, burning smells, or if your building is over 25 years old." },
      { question: "Do you provide emergency services?", answer: "Yes, we offer emergency electrical repair services for urgent situations." },
      { question: "Are your electricians certified?", answer: "All our electricians are professionally trained and certified to handle complex electrical work." },
      { question: "Can you upgrade my electrical panel?", answer: "Yes, we upgrade panels to accommodate increased power demands and improve safety." },
      { question: "Do you install smart home electrical systems?", answer: "Yes, we install smart switches, outlets, and home automation electrical infrastructure." }
    ],
    relatedSlugs: ["lights-repairs", "inverter-installation-repairs", "solar-energy-installation"]
  },
  {
    slug: "electric-fencing",
    title: "Electric Fencing",
    shortDescription: "Improve property security with alarm integration",
    icon: Fence,
    category: "Security",
    heroDescription: "Secure your perimeter with professional electric fence installation featuring alarm integration and monitoring systems.",
    whatWeDo: [
      "Electric fence design and installation",
      "Energizer and voltage regulator setup",
      "Alarm integration and monitoring",
      "Perimeter intrusion detection",
      "Fence maintenance and repairs",
      "Compliance with safety standards"
    ],
    benefits: [
      "Strong deterrent against intruders",
      "Immediate alarm notification",
      "Integration with CCTV systems",
      "Cost-effective perimeter security",
      "Low maintenance requirements",
      "Visible security presence"
    ],
    faqs: [
      { question: "Is electric fencing safe?", answer: "Yes, our systems deliver a strong but non-lethal shock. We install warning signs and follow all safety regulations." },
      { question: "What happens if someone touches the fence?", answer: "The person receives a deterrent shock and the alarm system is triggered, alerting you immediately." },
      { question: "Can electric fencing work with existing walls?", answer: "Yes, we can install electric fence strands on top of existing walls or fences." },
      { question: "How is the system powered?", answer: "Systems can be powered by mains electricity with battery backup, or fully solar-powered options are available." },
      { question: "Does weather affect the fence?", answer: "Our systems are designed to operate reliably in rain and all weather conditions." }
    ],
    relatedSlugs: ["smart-security", "electronic-gate-installation", "gate-installation"]
  },
  {
    slug: "carport-installation",
    title: "Carport Installation",
    shortDescription: "Custom design, fabrication and roof replacement",
    icon: Car,
    category: "Carports",
    heroDescription: "Protect your vehicles with custom-designed carports featuring durable construction and attractive designs.",
    whatWeDo: [
      "Custom carport design and fabrication",
      "Steel and aluminum structure installation",
      "Roof installation and replacement",
      "Solar panel integrated carports",
      "Multi-vehicle carport solutions",
      "Maintenance and repairs"
    ],
    benefits: [
      "Protection from sun, rain, and debris",
      "Extended vehicle lifespan",
      "Increased property aesthetics",
      "Potential for solar panel integration",
      "Durable, long-lasting construction",
      "Custom designs to match property"
    ],
    faqs: [
      { question: "What materials do you use for carports?", answer: "We primarily use galvanized steel and aluminum for durability, with options for polycarbonate or metal roofing." },
      { question: "Can I integrate solar panels with my carport?", answer: "Yes, we design carports specifically to support solar panel installation for added functionality." },
      { question: "How long does installation take?", answer: "Typical carport installation takes 2-5 days depending on size and complexity." },
      { question: "Do carports require foundation work?", answer: "Yes, we install proper foundations to ensure structural stability and longevity." },
      { question: "Can you match my property's design?", answer: "Absolutely, we customize designs to complement your property's architecture and color scheme." }
    ],
    relatedSlugs: ["solar-energy-installation", "gate-installation", "house-decoration-maintenance"]
  },
  {
    slug: "satellite-installation",
    title: "Satellite Installation",
    shortDescription: "Trusted, reliable and fast in response",
    icon: Satellite,
    category: "Satellite",
    heroDescription: "Professional satellite TV and internet installation with optimal signal positioning and multi-room distribution.",
    whatWeDo: [
      "Satellite dish installation and alignment",
      "Multi-room distribution setup",
      "Decoder installation and configuration",
      "Signal troubleshooting and optimization",
      "VSAT internet installation",
      "Dish realignment and maintenance"
    ],
    benefits: [
      "Crystal-clear TV reception",
      "Access to hundreds of channels",
      "Professional signal optimization",
      "Multi-room viewing capability",
      "Fast installation service",
      "Reliable after-sales support"
    ],
    faqs: [
      { question: "Which satellite providers do you install?", answer: "We install systems for all major providers including DSTV, GOtv, StarTimes, and others." },
      { question: "Can one dish serve multiple TVs?", answer: "Yes, we install multi-room systems allowing multiple TVs to receive satellite signals from one dish." },
      { question: "Why is my signal weak or cutting out?", answer: "Signal issues can result from dish alignment, weather, or obstructions. We diagnose and resolve these issues." },
      { question: "Do you install satellite internet?", answer: "Yes, we install VSAT systems for reliable internet connectivity in areas with poor terrestrial coverage." },
      { question: "How quickly can you respond to issues?", answer: "We aim for same-day or next-day response for service calls within our coverage area." }
    ],
    relatedSlugs: ["smart-security", "general-electrical", "lights-repairs"]
  },
  {
    slug: "house-decoration-maintenance",
    title: "House Decoration & Maintenance",
    shortDescription: "Painting, wallpapering and cleaning services",
    icon: PaintBucket,
    category: "Interiors/Partitioning",
    heroDescription: "Transform your space with professional painting, wallpapering, and maintenance services that refresh and protect your property.",
    whatWeDo: [
      "Interior and exterior painting",
      "Wallpaper installation and removal",
      "Surface preparation and repairs",
      "Color consultation and matching",
      "Protective coatings application",
      "General property maintenance"
    ],
    benefits: [
      "Fresh, updated property appearance",
      "Protection against weather damage",
      "Increased property value",
      "Professional, long-lasting finish",
      "Minimal disruption to daily life",
      "Comprehensive cleanup after work"
    ],
    faqs: [
      { question: "How long does interior painting take?", answer: "Timing depends on the area size. A typical room takes 1-2 days including preparation and drying time." },
      { question: "Do you help with color selection?", answer: "Yes, we provide color consultation to help you choose schemes that suit your space and preferences." },
      { question: "Is wallpaper still popular?", answer: "Yes, modern wallpapers offer beautiful designs and are increasingly popular for accent walls and feature spaces." },
      { question: "Do you move furniture?", answer: "Yes, we handle furniture moving and cover items to protect them during painting work." },
      { question: "What type of paint do you use?", answer: "We use high-quality, durable paints suitable for Nigerian climate conditions with excellent coverage." }
    ],
    relatedSlugs: ["interior-decoration-partitioning", "partitioning-repairs", "door-installation-repairs"]
  },
  {
    slug: "interior-decoration-partitioning",
    title: "Interior Decoration & Partitioning",
    shortDescription: "Space planning and layout optimization",
    icon: Grid3X3,
    category: "Interiors/Partitioning",
    heroDescription: "Optimize your space with professional interior partitioning and decoration services that transform functionality and aesthetics.",
    whatWeDo: [
      "Office and room partitioning",
      "Drywall installation and finishing",
      "Suspended ceiling installation",
      "Space planning consultation",
      "Custom built-in solutions",
      "Acoustic partitioning systems"
    ],
    benefits: [
      "Maximized use of available space",
      "Improved privacy and acoustics",
      "Professional office appearance",
      "Flexible, reconfigurable layouts",
      "Enhanced property functionality",
      "Cost-effective space division"
    ],
    faqs: [
      { question: "What types of partitions do you install?", answer: "We offer drywall, glass, aluminum, and movable partition systems to suit various needs and budgets." },
      { question: "Can partitions be removed later?", answer: "Yes, we install both permanent and demountable partitions depending on your flexibility requirements." },
      { question: "Do you handle suspended ceilings?", answer: "Yes, we install various suspended ceiling systems including acoustic tiles and decorative options." },
      { question: "How long does partitioning take?", answer: "Project duration depends on scope. Small office partitions may take days; larger projects take weeks." },
      { question: "Can you soundproof partitions?", answer: "Yes, we offer acoustic partitioning solutions for meeting rooms and spaces requiring sound privacy." }
    ],
    relatedSlugs: ["house-decoration-maintenance", "partitioning-repairs", "door-installation-repairs"]
  },
  {
    slug: "partitioning-repairs",
    title: "Partitioning Repairs",
    shortDescription: "Fixed and movable partition solutions",
    icon: Wrench,
    category: "Interiors/Partitioning",
    heroDescription: "Restore and repair partition systems with professional services that address damage, wear, and functionality issues.",
    whatWeDo: [
      "Drywall damage repair",
      "Partition door adjustment and repair",
      "Glass panel replacement",
      "Track and roller maintenance",
      "Surface refinishing and painting",
      "Hardware replacement"
    ],
    benefits: [
      "Restored functionality",
      "Extended partition lifespan",
      "Improved appearance",
      "Cost-effective alternative to replacement",
      "Minimal business disruption",
      "Professional, seamless repairs"
    ],
    faqs: [
      { question: "Can you repair water-damaged partitions?", answer: "Yes, we assess the damage and either repair or replace affected sections depending on severity." },
      { question: "My partition door is sticking, can you fix it?", answer: "Yes, we adjust tracks, rollers, and hinges to restore smooth operation." },
      { question: "Do you match existing finishes?", answer: "We carefully match paint colors and materials to blend repairs seamlessly with existing partitions." },
      { question: "Can you upgrade old partitions?", answer: "Yes, we can modernize partitions with new finishes, glass inserts, or updated hardware." },
      { question: "Do you work outside business hours?", answer: "Yes, we can schedule work during evenings or weekends to minimize disruption to your operations." }
    ],
    relatedSlugs: ["interior-decoration-partitioning", "house-decoration-maintenance", "door-installation-repairs"]
  },
  {
    slug: "lights-repairs",
    title: "Lights Repairs",
    shortDescription: "Lighting design and installation services",
    icon: Lightbulb,
    category: "Electrical",
    heroDescription: "Professional lighting repair and installation services to illuminate your spaces efficiently and beautifully.",
    whatWeDo: [
      "Light fixture repair and replacement",
      "LED upgrade installations",
      "Lighting design consultation",
      "Outdoor and landscape lighting",
      "Emergency lighting systems",
      "Dimmer and control installation"
    ],
    benefits: [
      "Improved lighting quality",
      "Energy-efficient LED solutions",
      "Enhanced ambiance and aesthetics",
      "Reduced electricity consumption",
      "Professional installation",
      "Safety compliance"
    ],
    faqs: [
      { question: "Should I upgrade to LED lights?", answer: "Yes, LEDs use 75% less energy than incandescent bulbs and last much longer, providing significant savings." },
      { question: "Can you install dimmer switches?", answer: "Yes, we install dimmer switches compatible with your lighting for adjustable ambiance and energy savings." },
      { question: "Do you design lighting layouts?", answer: "Yes, we provide consultation on optimal lighting placement for functionality and aesthetics." },
      { question: "Can you fix flickering lights?", answer: "Yes, flickering often indicates wiring or fixture issues that our technicians can diagnose and repair." },
      { question: "Do you install outdoor lighting?", answer: "Yes, we install security lights, landscape lighting, and pathway illumination designed for outdoor conditions." }
    ],
    relatedSlugs: ["general-electrical", "solar-street-lights", "solar-energy-installation"]
  },
  {
    slug: "door-installation-repairs",
    title: "Door Installation & Repairs",
    shortDescription: "Custom door design, fabrication and hardware",
    icon: Home,
    category: "Interiors/Partitioning",
    heroDescription: "Professional door installation and repair services for residential and commercial properties, including custom designs.",
    whatWeDo: [
      "Interior and exterior door installation",
      "Custom door fabrication",
      "Security door fitting",
      "Door frame repairs",
      "Lock and hardware installation",
      "Automatic door systems"
    ],
    benefits: [
      "Enhanced security and privacy",
      "Improved property aesthetics",
      "Energy efficiency (insulated doors)",
      "Custom solutions for any space",
      "Professional installation guarantee",
      "Durable, long-lasting results"
    ],
    faqs: [
      { question: "What types of doors do you install?", answer: "We install wood, steel, aluminum, glass, and composite doors for both interior and exterior applications." },
      { question: "Can you install security doors?", answer: "Yes, we install reinforced security doors with advanced locking systems for maximum protection." },
      { question: "Do you repair old doors?", answer: "Yes, we repair sagging doors, damaged frames, and faulty hardware, or advise on replacement if needed." },
      { question: "Can you match existing door styles?", answer: "Yes, we custom-fabricate doors to match your property's existing architectural style." },
      { question: "Do you install automatic doors?", answer: "Yes, we install automatic sliding and swing doors for commercial and accessibility applications." }
    ],
    relatedSlugs: ["interior-decoration-partitioning", "electronic-gate-installation", "house-decoration-maintenance"]
  },
  {
    slug: "gate-installation",
    title: "Gate Installation",
    shortDescription: "Complete gate solutions for your property",
    icon: Lock,
    category: "Gates/Fencing",
    heroDescription: "Complete gate installation services from design to fabrication, ensuring security and aesthetic appeal for your property.",
    whatWeDo: [
      "Custom gate design and fabrication",
      "Sliding and swing gate installation",
      "Steel and wrought iron gates",
      "Gate post and foundation work",
      "Lock and access system fitting",
      "Gate maintenance and repairs"
    ],
    benefits: [
      "Enhanced property security",
      "Custom designs to match property",
      "Durable, weather-resistant construction",
      "Increased property value",
      "Professional installation",
      "Option for future automation"
    ],
    faqs: [
      { question: "What gate materials do you work with?", answer: "We work with steel, wrought iron, aluminum, and wood, offering various finishes and designs." },
      { question: "Can you automate a new gate later?", answer: "Yes, we design gates with automation in mind, making future upgrades straightforward." },
      { question: "How long does gate installation take?", answer: "Standard gate installation takes 3-7 days including foundation work and finishing." },
      { question: "Do you provide gate maintenance?", answer: "Yes, we offer maintenance services including rust treatment, lubrication, and hardware checks." },
      { question: "Can you match existing property aesthetics?", answer: "Absolutely, we custom-design gates to complement your property's architecture and style." }
    ],
    relatedSlugs: ["electronic-gate-installation", "electric-fencing", "smart-security"]
  }
];

export const getServiceBySlug = (slug: string): Service | undefined => {
  return services.find(s => s.slug === slug);
};

export const getRelatedServices = (slugs: string[]): Service[] => {
  return slugs.map(slug => services.find(s => s.slug === slug)).filter(Boolean) as Service[];
};

export const categories = [
  "Security",
  "Solar",
  "Electrical",
  "Gates/Fencing",
  "Inverter",
  "Interiors/Partitioning",
  "Carports",
  "Satellite",
  "Street Lights"
] as const;
