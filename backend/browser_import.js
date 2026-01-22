
// 🚀 Job Import Script - Paste this in Browser Console
// Make sure you're logged in as a recruiter first!

(async function importJobs() {
    console.log('🚀 Starting job import...');
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        console.error('❌ Not logged in! Please login first.');
        return;
    }
    
    const userId = session.user.id;
    console.log('✅ Logged in as:', session.user.email);
    
    // Jobs to import
    const jobs = [
  {
    "title": "Information Technology Technician",
    "description": "At\u00a0McLane Intelligent Solutions, we attribute our success to our remarkable staff.\u00a0 We promote career growth, ongoing learning and professional development for all of our employees.\u00a0 We also offer a level of dedication to our employees that is second-to-none.\u00a0Ask yourself this:Are you passionate about working with computers?\u00a0 Do you enjoy helping your family and friends with their technical problems?\u00a0 Do you love learning and want to expand your IT skills?\u00a0 Do you have experience with networks, workstations and servers?\u00a0Then look no further, we want you on our team!\u00a0 This is your opportunity to work with other people who are passionate about technology in an atmosphere that promotes challenge and teamwork, yet honors your life outside of work.What Do We Do?McLane Intelligent Solutions is a fast-growing managed services provider (MSP) located in Central Texas. We provide a broad range of outsourced IT services including design, installation, support, maintenance and consulting to the\u00a0Small/Medium Business\u00a0market.\u00a0Why do you want to join us?Benefits - We have great health insurance and paid time off. We provide a weekly Awesome Teammate Bonus, where employees nominate other employees for exceptional work.\u00a0Each full-time employee also has a monthly personal and team bonus with specific targets for performance, so you always know how you\u2019re doing.Growth - We work with each technician to help them become certified and advance in their knowledge of the field. We also promote from within because we believe in building our employees to be our future leaders.Extraordinary People and Culture - We pride ourselves on having great communication within our company. Each employee meets with their supervisor regularly to discuss their individual development and we have a company-wide weekly meeting to go over our company\u2019s progress.Values \u2013 Our company has five values that drive how we do business: Integrity, Service above Self, Work with Rigor at Work, Authentic Conversation, and Enjoy and be a Joy.Due to growth, we have the following positions on our available in\u00a0College Station/Bryan, TX:Information Technology Technician- ($30K-$45K DOE)",
    "requirements": "Experience in providing customer service on-site and remote on a technical level to an end user clientExperience with LAN/WAN network technologies (i.e. installation of routers, switches, and network client software)Hands on technical PC support and service experience, desktop and laptop hardware and software troubleshooting, installation, configuration and upgradesExperience with desktop operating systems and application software products in a Windows environment.Excellent oral/written communication skills (emphasis on technical communication) in a business environment.\u00a0 Must be fluent in the English language.Valid driver\u2019s license/good driving record, and reliable transportationCandidate must have ability to pass an extensive background check and drug screen.PREFERRED\u00a0(but not required):Associate\u2019s Degree in Computer Science, or similar discipline and minimum of 2+ years\u2019 experience.\u00a0 Education can be replaced with years of experience.Certifications such as A+, Network +, MTA, etc., are a plus but not required.TCP/IP, DNS, DHCP and Cisco firewalls and switchesTerminal Services a plusMS Server experience a plusPHYSICAL REQUIREMENTS:Ability bend, crouch, crawl\u00a0Ability to lift up to 75 lbs.\u00a0Ability to use phone and phone headset\u00a0Ability to type using a keyboard and mous",
    "location": "US, TX, College Station",
    "company_name": "At McLane Intel, we believe that everyone should love where they work!\u00a0We understand that our ongoin",
    "salary_min": 30000,
    "salary_max": 45000,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": null,
    "benefits": "All qualified McLane Intelligent Solutions employees receive:Paid VacationAmazing Health, Dental, Vision, and prescription insurance\u00a0Short-term and long-term disability benefits\u00a0401K\u00a0Flexible Spending Accounts\u00a0Company provided Life InsuranceAnd much more...Come explore what life in Central Texas is all about in a family friendly community and company!McLane Intelligent Solutions is an equal opportunity employer.\u00a0 We consider applicants for all positions without regard to race, color, religion, gender, national origin, age, marital status, sexual identification or veteran status, the presence of a non-job-related medical condition or handicap, or any other legally protected status.",
    "remote_ok": false,
    "status": "open",
    "industry": "Information Technology and Services"
  },
  {
    "title": "General Clerk 1 - Call Center Agent",
    "description": "We are currently seeking a General Clerk I - Call Center Agent. The right candidate will be an integral part of our talented team, supporting our continued growth. This position will be located in our Washington, DC location.Responsibilities include, but are not limited to:Receiving and directing calls in a professional mannerOpen mail manually or by use of high speed openers or auto-assist extraction equipmentIdentify, classify and sort documentsPrepare mail and documents for scanningAssemble document batches, verifying document and/or page volumesLift large boxes of paper for storage or production useHandle time-sensitive materialsHandle confidential materialsProcess cash, or checks in accordance with security and operating policies and proceduresPerform daily key-operator mail processing equipment maintenancePerform duties and special requests as assigned by team leader and managerEnsure operating and quality standards are met based on service objectivesMaintain accuracy of required reports, logs and measurementsEnsure the highest levels of customer careIdentify and refer sales-cues leading to potential add-on businessEnsure adherence to business guidelines, safety &amp; security proceduresSupport financial results by minimizing site waste and reworkBUFFER: This is a short term position up to 2 years with potential for extension beyond. This position offers\u00a0Novitex full time benefit packages excluding severance and long term disability. This position could become a long term position but this is not a promise of employment for any period of time.",
    "requirements": "Required Qualifications:Minimum of 1 year customer service related experience preferred1 year of experience performing tasks supporting document scanning and imaging (or related applications, such as microfilming or high volume reprographics)Keyboarding skills requiredAbility to communicate effectively both in verbal and written formAbility to effectively work individually or in a team environmentAbility to handle multiple projects simultaneouslyAbility to adapt to change in a fast-growing production environmentStrong organizational and administrative skillsDemonstrated ability to show initiative and accept ownership of projectsAbility to use problem-solving skills in order to resolve client issuesBasic mathematical knowledgeAbility to meet employer's attendance policyWork experience in email and Microsoft Windows environments is requiredMay be required to lift items weighing up to 50 poundsMay be required to stand for long periods of timeHS Diploma or equivalent (GED) required",
    "location": "US, DC, DC",
    "company_name": "Novitex Enterprise Solutions, formerly Pitney Bowes Management Services, delivers innovative documen",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": null,
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": "Facilities Services"
  },
  {
    "title": "Intake Therapist",
    "description": "We believe in changing\u00a0the face of the mental health industry. In fact, Mind Above Matter was founded in 2010 out of a desire to bring a more compassionate, client-focused approach to mental health within the community reach. We believe that creating a therapeutic environment for our clients\u00a0starts with our company culture and staff. We offer flexible scheduling, encourage creative therapy interventions, quarterly incentives and ongoing support and training to all our employees. Come see the difference at Mind Above Matter! We offer a variety of services to our clients, including partial hospitalization, intensive outpatient, weekly outpatient, assessments, and medication management.We are currently seeking independently licensed clinicians (LCSW, LPC, or LMFT) to complete intake assessments daily at a facility-based private practice in Keller and Burleson. The successful candidate must be able to work independently and efficiently and will be responsible for documentation and managing leadership roles. Inpatient intake experience is preferred. Immediate position with a full caseload is available at our Keller location. There will be opportunities for growth in the near future dependent upon performance and qualifications.Additional benefits to independently licensed clinicians:\u2022 A collaborative model that allows time for employee training, weekly staff meetings, peer consultations and inter-department coordination\u2022 Flexible Scheduling\u2022 Opportunities for advancement\u2022 Paid EMR, marketing, billing, collection, as well as credentialing process and updatesIf interested, please\u00a0submit your resume/CV. Only Master's level clinicians\u00a0with independent licenses will be considered.",
    "requirements": "Only Master's level clinicians\u00a0with independent licenses will be considered (LPC, LMFT, LCSW).",
    "location": "US, TX, DFW",
    "company_name": "At MAM, we are passionate about changing the culture of the mental health industry",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "Benefits are provided to the successful candidate after a 90 day performance evaluation. Benefits include: PTO, paid holidays, medical, and dental.\u00a0",
    "remote_ok": false,
    "status": "open",
    "industry": "Mental Health Care"
  },
  {
    "title": "Collection Specialist ",
    "description": "Responsible for the control, documentation, resolution and follow up of various delinquent consumer and mortgage loansResponsible for contacting members to determine the reason for past-due accountsFollow up with correspondence or calls on delinquent loan accounts until resolution, recommend actions to be taken. \u00a0Document all work (i.e., phone calls, promises to pay, updates, requests in our system, the day the action occurs,Maintain accurate records on all accounts. Ensure that future follow\u2011up dates are maintained on all accounts,Provide maximum coverage of their delinquent queue assignment and guarantee that there are no accounts with follow up dates that have passed.\u00a0Work out and negotiate payment plans with clients when necessary \u00a0",
    "requirements": "Minimum 3 years\u2019 experience with credit and collectionsAbility to develop strong phone skills to effectively work with Members.\u00a0Developing negotiation skills to arrive at best overall solutions within established guidelines.Writing ability to clearly document calls.PC Skills, including loan software, Outlook and Microsoft Office.\u00a0Excellent verbal and written communication skills.\u00a0Strong interpersonal and organizational skills.\u00a0Ability to prioritize and meet deadlines.\u00a0",
    "location": "US, MA, Woburn",
    "company_name": "Outstanding Member Service Starts With Outstanding PeopleIf you are committed to the concept of \u201cabo",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": null,
    "benefits": "Ability to prioritize and meet deadlines.\u00a0BENEFITS PACKAGE includes:Medical/Dental/Vision401(k) w/ matchGym membership reimbursement\u00a0Bonus &amp; more!\u00a0",
    "remote_ok": false,
    "status": "open",
    "industry": "Financial Services"
  },
  {
    "title": "Customer Service Associate/Shipping and Receiving ",
    "description": "The Customer Service Associate will be based in Sunnyvale, CA. The right candidate will be an integral part of our talented team, supporting our continued growth.Responsibilities:Perform various Mail Center activities (sorting, metering, folding, inserting, delivery, pickup, etc.)Lift heavy boxes, files or paper when neededMaintain the highest levels of customer care while demonstrating a friendly and cooperative attitudeDemonstrate flexibility in satisfying customer demands in a high volume, production environmentConsistently adhere to business procedure guidelinesAdhere to all safety proceduresTake direction from supervisor or site managerMaintain all logs and reporting documentation; attention to detailParticipate in cross-training and perform other duties as assigned (Filing, outgoing shipments, etc)Operating mailing, copy or scanning equipmentShipping &amp; ReceivingHandle time-sensitive material like confidential, urgent packagesMaintain the highest levels of customer care while demonstrating a friendly and cooperative attitudePerform other tasks as assignedScanning incoming mail to recipientsPerform file purges and pullsCreate files and ship filesProvide backfill when neededEnter information daily into spreadsheetsIdentify charges and match them to billingSort and deliver mail, small packages",
    "requirements": "Position Requirements:Valid driver\u2019s license with a good driving record requiredComputer skills: Basic Microsoft office, Outlook, FedEx &amp; UPS power ship, various web applicationsCustomer service related experienceExcellent communication skills both verbal and writtenAbility to effectively work individually or in a team environmentAbility to meet company attendance policyLifting up to 40lbs or max allowed by state lawStanding for long periods of time and significant walking, with or without accommodationSignificant walking with or without accommodationFork lift certified or willing to be certifiedDangerous goods shipping certification &amp; training or willing to be certifiedWillingness to submit to a pre-employment drug screen and criminal background check\u00a0Preferred Qualifications:1 year experience in Shipping and Receiving preferredMinimum of 1 year experience in Shipping/ReceivingHigh school diploma or equivalent (GED)",
    "location": "US, CA, Sunnyvale",
    "company_name": "Novitex Enterprise Solutions, formerly Pitney Bowes Management Services, delivers innovative documen",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": [
      "AWS"
    ],
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": "Computer Software"
  },
  {
    "title": "Technical Support Analyst - VIP Event Posting",
    "description": "What is a VIP Event? The exclusive opportunity to have an onsite interview with our executive teamWhy?  Quick turnaround! Guaranteed interview! All you have to do is pass our online assesment and impress us with your resumeWhen? September 18th, 2014 from 3 - 6 PM (Interviews will take place in time blocks)What now? Apply! Also, if you a referred by an HCSS employee make sure to put them down as referral!Essential Position FunctionsFocus on customer satisfaction is the number one priority for our technical support staff and is what has made HCSS the leader in our industry. As the face of HCSS to our customers we are expected to live up to our reputation by reacting quickly, professionally and in a friendly manner at all times. \u00a0If you believe in superior customer service and rapport, HCSS may be the right place for you. We are always hiring for exceptional talent, and we have multiple openings for this position.A successful Technical Support Analyst will:Month 1:Demonstrate full understanding of Windows file sharing and permissionsProvide timely resolutions to customer reported issues, under supervisionDemonstrate understanding of basic functions on Android and iOS devicesContribute to an existing support project, exhibiting collaboration skillsMonth 2:Work independently to provide timely resolutions to customer reported issuesMaster the art of creating sufficiently detailed call logs for support ticketsWrite and maintain product knowledge base articlesMonth 3-4:Achieve average support survey rating of at least 9.5 out of 10Complete one process improvement ideaDemonstrate level of product knowledge required to participate in rotating after hours supportOne Year and Beyond:Lead complex support projects with minimal guidanceActively participate in the training of new Technical Support Analysts",
    "requirements": "What We Look ForThe ideal candidate will have excellent problem solving, analytical, and people skills. If you excel at solving word problems, \"thinking games\", have strong math skills, and can quickly assimilate technical information, you may have what it takes to join the elite technical service representatives at HCSS. Our analysts spend the majority of their day talking with and helping our customers with their HCSS-related software problems over the phone, in one-on-one sessions, and trainings. They will also spend time working on various projects to enhance our service offerings to our customers.Non-Smokers only, please.",
    "location": "US, TX, Sugar Land",
    "company_name": "Since 1986, we've offered\u00a0world-class software\u00a0that has changed how the construction industry operat",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": "Information Technology and Services"
  },
  {
    "title": "PeopleSoft Campus Solutions Analyst-Financial Aid",
    "description": "Apply For This Job HereJob Title:\u00a0 \u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 PeopleSoft Campus Solutions Analyst-Financial AidLocation:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0 Dallas/Fort Worth, Texas\u00a0Responsibilities:\u00a0Perform system review, data mapping and data analysisProvide user assistance and direction for ad hoc reporting\u00a0",
    "requirements": "Apply For This Job HereRequirements:Bachelor\u2019s Degree2 years of PeopleSoft Systems Analyst experienceExperience with Peoplesoft v 8.8 or higherMust have experience Campus Solutions-Financial AidMust have experience integrating PeopleSoft with non PeopleSoft applications\u00a0",
    "location": "US, TX, Dallas/Fort Worth",
    "company_name": "We Provide Full Time Permanent Positions for many medium to large US companies",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "This position offers EXCELLENT benefits, retirement program and work life balance.",
    "remote_ok": false,
    "status": "open",
    "industry": null
  },
  {
    "title": "Advisory & Consulting Associate",
    "description": "Green Street\u2019s Advisory and Consulting group is a dynamic, widely respected team that is looking to add an Associate to support its growth and success.\u00a0 The Associate position provides a terrific opportunity for highly motivated junior candidate to get involved in a variety of projects spanning the commercial real estate spectrum including apartments, office, industrial, hotels, malls, shopping centers, and health care.\u00a0 Clients include large owners and developers, non-traded REITs, operating companies with sizeable real estate holdings, pension funds, hedge funds, and other private and public market real estate investors.\u00a0 Services provided by the group include strategic planning, valuation, transaction advisory, industry benchmarking, and tactical investment advice.\u00a0The Associate role is fast-paced, demanding, and requires someone willing to roll up their sleeves to get the job done, often under a tight time frame.\u00a0 Green Street\u2019s reputation in the commercial real estate industry is top notch, and we are looking for junior people who are ready to take on responsibility early in their careers and learn fast. \u00a0The day-to-day job will include:Creating and updating critical slides used for client and business development presentationsDistilling complex financial information into user-friendly presentation formatsBeing told \u201cWe need information on XYZ\u201d and figuring out where it is and how to get itMaintaining, developing, and auditing financial models primarily utilizing Microsoft ExcelManaging databases, including updating and maintaining data in our proprietary internal systemsCompleting ad hoc projects that constantly arise in our rapidly expanding pipeline of business",
    "requirements": "We are highly selective \u2013 candidates should have most of the following:A passion for real estate and the financial marketsAn undergraduate degree in Finance, Statistics, Engineering, Financial Engineering, Economics, Mathematics or other program that is technical and quantitative in natureStrong analytical skills combined with an ability to \u201cconnect the dots\u201d and reach meaningful conclusionsStrong attention to detail and commitment to data integrityEnjoy problem solving and have excellent communication skillsSuperb project/time management and organizational proficiencyAbility to work independently as well as collaboratively, and to accept constructive adviceStrong knowledge of Microsoft Excel and PowerPoint is required; Access knowledge is a plusMust be comfortable working with imperfect data and tight timelinesExcel VBA programming experience",
    "location": "US, CA, Newport Beach",
    "company_name": "Green Street Advisors is the industry leader in real estate and real estate investment trust (REITs)",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": null,
    "benefits": "Green Street offers a competitive salary and benefits package that includes health, dental, and life insurance, long term disability, paid vacation, and holidays, and a 401(k) match.\u00a0 We also offer voluntary benefits such as flexible spending and vision care.Green Street Advisors, Inc. is an Equal Opportunity Employer",
    "remote_ok": false,
    "status": "open",
    "industry": "Financial Services"
  },
  {
    "title": "Beauty & Fragrance consultants needed",
    "description": "Luxury beauty &amp; fragrance consultants needed!Pure Placements\u00a0are a specialist luxury retail recruitment agency, specialising is temporary &amp; permanent beauty, fragrance, fashion &amp; retail staff.\u00a0We are recruiting now for beauty &amp; fragrance consultants to work within department stores across the country promoting luxury products such as make up, skin care &amp; perfume, must come from a beauty/retail background,\u00a0exceptional customer service skills are a must!\u00a0If you feel you have relevant experience and want to join our fantastic team\u00a0please email a copy of\u00a0your CV with a recent full length or head shot\u00a0photo to #EMAIL_11046aef5219327c0db0b1c912c1ba032e7a569ddfc256050c7a98cd16ae9e57#",
    "requirements": null,
    "location": "GB, , Uxbridge",
    "company_name": "Established on the principles that full time education is not for everyone Spectrum Learning is made",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": null
  },
  {
    "title": "Web Developer",
    "description": "KeyMe is a robotics company based in NYC. We have a fun and laid back culture with highly motivated team members. Our focus is using machine vision and machine learning to bring innovation to the locksmith industry. We are looking for a talented web developer to join to our robotics team.You will work on a team that is designing and building a network of robotic kiosks. These kiosks allow anyone to scan physical house keys into our cloud database and also create physical keys using a robotic inventory and key cutting system.You will be in charge of the kiosk user interface, working with designers to create a user experience that is intuitive, beautiful and fun.",
    "requirements": "Need to know: javascript, jquery, html, cssGood to know: git, linux, bash, angular/backbone/ember, python, aws, gimp, inkscape, video editing",
    "location": "US, NY, New York",
    "company_name": "Company",
    "salary_min": 50000,
    "salary_max": 100000,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": [
      "Python",
      "Java",
      "JavaScript",
      "AWS"
    ],
    "benefits": "Salary, stock options, health care, dental, vision, communter benefits, and snacks",
    "remote_ok": false,
    "status": "open",
    "industry": "Retail"
  },
  {
    "title": "Part Time Driver and Handler",
    "description": "Shyp is in search of smart, friendly, safety-conscious women and men to operate company vehicles and provide courteous and efficient\u00a0pick-up of items on a part-time schedule; to check items for conformance to Shyp features of service; to provide coverage for all assigned routes within the service area; and to provide related customer service functions.Duties:Provides efficient and safe pick up of packages and documents, while representing the company in a professional manner.Operates non-articulated vehicles safely and efficiently, complying with all governmental and corporate procedures.Accomplishes accurate and timely selection and inspection of assigned items and the subsequent reporting of stop counts and missing items.\u00a0Scans items according to prescribed procedures; demonstrates proficiency in features of service and equipment.Meets aircraft and transports packages as required for sorting operations.Loads and unloads aircraft, containers and company vehicles; operates mechanized ramp equipment to load and unload packages.Cleans, washes and performs minor maintenance to company vehicles as necessary, maintains neat and clean personal appearance to uphold Shyp's public image.",
    "requirements": "High school diploma or equivalent educationMust be at least 19 years old and have a minimum of two years of driving experienceValid and current driver's licenseValid and current proof of insurance (even if the courier is only driving the company vehicle)Ability to comply with any specialized regulatory or licensing requirements, as determined by geographic location and/or work assignment; Shyp will communicate any specialized regulatory or licensing requirements during the hiring process. Must attain satisfactory completion of specialized training regarding transportation of goods with special handling requirements including, but not limited to, dry ice, clinical samples and/or medical products.Must be able to utilize\u00a0an iOS in quick and efficient manner.For new hires, must meet all Shyp employment qualifications at time of hiring, including successful passing of background checkESSENTIAL FUNCTIONS:Ability to stand during entire shift, excluding meal and rest periodsAbility to move and lift 75 pounds and maneuver packages of any weight above 75 lbs with appropriate equipment and/or assistance from another personAbility, on a consistent basis, to:bend/twist at the waist and kneescommunicate effectively with customers, vendors, and other team membersperform work activities requiring cooperation and instructionfunction in a fast-paced environment, under substantial pressuremaintain attention and concentration for extended periods of timework with minimal supervisionreport regularly to work and maintain established business hours in order to support the Shyp business; regular attendance and/or reporting could include regular attendance at a physical location and/or maintaining established business hours depending on the scope and nature of the position",
    "location": "US, NY, Brooklyn",
    "company_name": "Shyp is the easiest way to send anything, anywhere",
    "salary_min": null,
    "salary_max": null,
    "job_type": "part-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "Be a part of a fun, friendly cultureOpportunity to play a role in shaping a world-class operations teamWork with an incredible fleet that never settles in their pursuit of excellence",
    "remote_ok": false,
    "status": "open",
    "industry": "Logistics and Supply Chain"
  },
  {
    "title": "Intern",
    "description": "ObjectiveWe are looking for a web graphic designer who loves creating great software and products as much as we do. An excellent candidate will be strong in most of the requested qualifications.ResponsibilitiesThis is a really exciting opportunity for a designer who wants to play a key role in our product evolution. We\u2019re looking to combine your ideas and expertise with our vision to create a top notch product. You will be working with our existing international team of developers and designers (located both in San Francisco and Milan) to create new interfaces, evolve existing ones and be part of new lines of products. We work in a young and informal environment with edge technologies and challenging problems to solve.",
    "requirements": "\u2022 Energetic self-starter who shows personal initiative\u2022 Good knowledge of English (oral and written) is required\u2022 Good understanding of modern Web UI technologies including: HTML5, CSS3, JavaScript, jQuery, Twitter Bootstrap, adaptive/responsive layouts\u2022 Strong understanding of design trends and best practices, as they relate to web and product design\u2022 Online portfolio that demonstrates your ability to work in multiple styles, understanding of design elements and principles, and includes examples of your design process\u2022 Demonstrated control of typography, color theory, and other design elements and principles\u2022 Excellent knowledge of Adobe CS (Photoshop, Illustrator, Fireworks)\u2022 Workable knowledge of the QQQQK5 suite\u2022 Solid understanding of user-centered design processes, usability principles and information architecture\u2022 Experience working in distributed teams is a big plus",
    "location": "IT, 25, Milan",
    "company_name": "Company",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": [
      "Java",
      "JavaScript"
    ],
    "benefits": "Very competitive Salary\u2022 Opportunity to work with committed, talented people with a great sense of humor",
    "remote_ok": true,
    "status": "open",
    "industry": null
  },
  {
    "title": "Sales Manager",
    "description": "(We have more than 1500+ Job openings in our website and some of them are relevant to this job. Feel free to search it in the website and apply directly. Just Click the \u201cApply Now\u201d and you will redirect to our main website where you can search for the other jobs.)(Click\u00a0\u201cApply Now\u201d\u00a0to know more about Salary, Job description and Location)Achieve quarterly and annual sales targetsProspect, secure meetings, and close new key account business with key decision makers in specified target accountsAttend sales call appointments to support sales opportunitiesWe have many more Global Healthcare \u200bProfessionals jobs are available in our website. Please go through our website and search the relevant job and apply directly.Visit: #URL_ec64af2b4fe2ca316e828f93b0cd098c22f8beba98dcac09d4dd7384b221a5e8#-#URL_9753a54b28303bf636a2816399b9c255d76fabb791336a4c748da2611a23264f#",
    "requirements": null,
    "location": "US, CA, San Francisco",
    "company_name": "We Provide Full Time Permanent Positions for many medium to large US companies",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": "Marketing and Advertising"
  },
  {
    "title": "Senior Marketing Analyst",
    "description": "The Senior Marketing Analyst will be responsible for creating, maintaining and presenting the relevant criteria to measure country and marketing channels performance and provide the supporting analysis for improvement as identified. He/she will turn data into insights and enable decisions through his/her actionable insights.Main tasks will include:Manage, automate and continuously improve dashboards and ongoing reporting of key performance indicators across multiple geographies and marketing channels.Develop data-driven actionable insights to enable key business decisions for our country managers and head of marketing channels to challenge their thinking and become a trusted adviser and impartial counsel regarding performance.Manage the preparation of annual budgets and monthly rolling forecasts including historical trends, planned versus actual marketing spent and performance of ongoing marketing campaigns. Deliver actionable recommendations to continuously improve our business and marketing performanceCombine a good understanding of in-country trends and marketing initiatives with the external market perspective in order to explain the drivers of variances vs. expectations.\u00a0Synthesize and communicate key marketing insights across the wider organization and support senior management in the preparation of key external meetingsProvide end-to-end analytical support for new business projects",
    "requirements": "At least 3 years\u2019 experience as business analyst, including experience in budgeting and forecasting. Experience working in an investment bank, management consulting firm or a fast-paced, high volume web, ecommerce or software as a service environment a plus.A well-rounded academic background, ideally in finance, economics or business is recommended. An aptitude for numbers is an absolute must: be able to demonstrate your quantitative skills!Significant experience analyzing large sets of data and the ability to proactively identify issues, generate analytical insights and present action-oriented recommendations in a simple way.Superior organizational skills and a demonstrated ability to function successfully in an environment with multiple and shifting priorities. Able to manage projects independently and ready to assume a high level of responsibility as a member of a team.Self-starter with the ability to build rapport with other team members and cross-functional department thanks to a collaborative working style and strong interpersonal skills. Intellectual curiosity and passion about utilizing data to illuminate opportunities and identify issues.Advanced technical and financial modelling skills in Microsoft Excel. Intermediate to advanced Microsoft Powerpoint and SQL. Hands on experience with\u00a0\u00a0Google Analytics or similar tools a plus.",
    "location": "DE, BE, Berlin",
    "company_name": "Babbel enables anyone to learn languages in an easy and interactive way",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": [
      "SQL"
    ],
    "benefits": "Responsibility from day one with a work that will have a significant impact on the company performanceIncreasing responsibilities if you perform well, combined with numerous development and \u00a0career opportunitiesWork in a high growth, truly international company and learn from an international team with strong marketing expertise\u00a0",
    "remote_ok": false,
    "status": "open",
    "industry": null
  },
  {
    "title": "Application Specialist",
    "description": "Do you consider yourself a \u201cRock Star\u201d? Do you want to make a difference\u2026 at a company that is making a big difference in the world of small business lending? If so\u2026 Swift Capital may be exactly what you\u2019re looking for. We\u2019re growing fast \u2026 very fast! We've more than doubled the size of our team last year, and will do the same again this year. We are looking for smart and energetic people to join our awesome team. Swift Capital offers a unique opportunity to work in a fast-paced environment for a company that is changing the way small businesses get access to funding.You will have responsibility for consolidating, checking, and processing documents obtained by our Acquisitions Team prior to submission for underwriting review. This Application Specialist will need to demonstrate a strong attention to detail, the ability to multi-task, and the ability to work in a fast paced and paperless environment.The successful candidate will perform the following activities:\uf0fc Ensure the small business owner applications and all documents are complete prior to submitting the application for underwriting review\uf0fc Calculate and process data submitted by small business owners, including information from credit card processing statements and business checking account statements\uf0fc Process applications received from business partners\uf0fc Conduct public records searches on small businesses, and attach the results to the system for review\uf0fc Identify, research and report any inconsistencies with the application to management, in the effort of combating fraud\uf0fc Assist in other areas of the company as needed to ensure service levels and financial targets are exceeded",
    "requirements": "The Successful CandidateSwift Capital seeks energetic, passionate, smart, competitive and driven professional that can rise to the challenge to make us #1 in the market. Our future high-impact performer will:\u00a0\uf0fc Have experience working in a fast paced environment and a desire to be a top performer\uf0fc Have excellent data processing skills, including data entry speed and accuracy\uf0fc Have proficient PC skills, especially using MS-Office Suite\uf0fc Have a general understanding of loan processing requirements\uf0fc Have familiarity with reviewing bank statements\u00a0\uf0fc Demonstrate excellent analytical skills, and ability to work independently\uf0fc Be open to leveraging new tools\uf0fc Be up for challenges and will dig in and do what needs to be done, especially when our response volumes peak, or when we are shooting for a strong close to the month\uf0fc Have uncompromising integrity\u00a0Preferred Qualifications\uf0fc Strong understanding of merchant cash advance, credit card or merchant processing\uf0fc Previous financial services experience\uf0fc Experience in loan processing\uf0fc Previous small business banking experience\uf0fc Knowledge of Salesforce\uf0fc Knowledge of Westlaw\uf0fc Associate\u2019s or Bachelor\u2019s degree",
    "location": "US, DE, Wilmington",
    "company_name": "Swift Capital began with a simple idea",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "We provide challenging opportunities for you to develop yourself and advance your career. We provide attractive, comprehensive compensation packages that recognize and reward your significant contributions.We also provide first rate benefits programs, including comprehensive medical, dental and vision, life insurance, and 401K.Plus, we have some great workplace perks...Casual dressBright, open workspaces (no cube farms here)Fully stocked kitchen filled with healthy (free) snacksFlexible PTO and holiday policiesRegular company town hall meetingsSocial eventsSounds like someplace where you\u2019ll thrive? We are actively hiring!",
    "remote_ok": false,
    "status": "open",
    "industry": "Financial Services"
  },
  {
    "title": "CNC Programmer",
    "description": "(We have more than 1500+ Job openings in our website and some of them are relevant to this job. Feel free to search it in the website and apply directly. Just Click the \u201cApply Now\u201d and you will redirect to our main website where you can search for the other jobs.)#URL_94f805e93a6fa859cd8540e9767e187e295d764a384221d77f8880142b6416b7#-#URL_dbdb917780b325918ec611d0f47d6a0dff5ee871b96bc71180616d0d0570925b#Job Requirements:Must be familiar with Job Shop type operations.CAM and CAD experience a major plus.Ideal candidate will have a minimum of 10 yrs experience and have as strong of a manual manufacturing background as he does with CNC equipment. The machinery list for the facility is split between very large CNC Mill, Manual Mills and Lathes and some small MAZAK (w/ Mazatrol Controls)Job Responsibilities:The Shift is 1stThere is overtime, but it fluctuates.",
    "requirements": null,
    "location": "US, OH, Cleveland",
    "company_name": "We Provide Full Time Permanent Positions for many medium to large US companies",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "",
    "remote_ok": false,
    "status": "open",
    "industry": null
  },
  {
    "title": "Agent inbound business",
    "description": "Job Description:Winning solutions delivered by proven experts. Ibex Global is a top-ten, global, outsourced contact center provider. Ibex Global helps organizations across industries to achieve key objectives, such as increasing customer acquisitions, strengthening customer relationships, and growing share-of-wallet. Currently, Ibex Global has over 20 contact and processing centers on five continents. Through them and our employees, we support inbound and outbound communications using the telephone, the Web, and e-mail. We welcome interest from people who understand and enjoy customer care and sales, market research and analysis, and providing excellent service. Ibex Global practices quality management through communications technologies. We offer opportunities to pursue a career in several locations around the world.\u00a0Ibex Global employees find the work we do for our clients challenging and rewarding, our pay competitive, and our benefits comprehensive using prescribed performance management techniques.\u00a0",
    "requirements": "Ibex Global invites you to learn more about an exciting career opportunity. We are fast-growing, hard-working, and focused on building the very best business in the industry. We are currently hiring Inside Sales Representatives for a NEW department within Ibex Global. Sales Representatives will be taking inbound business to business sales calls on behalf of AT&amp;T. Telecommunications experience or prior experience with core AT&amp;T products such as DSL, wireless, and data solutions is a plus. Other responsibilities will include meeting annual sales objectives and continuously raising the sales bar in a competitive environment.\u00a0JOB REQUIREMENTS:\u2022 Candidates must have good communication skills.\u2022 Strong Customer Service and Telephone Sales experience is required.\u00a0\u2022 High school Diploma or G.E.D preferred. .\u00a0\u2022 Must have a good work ethic and positive attitude.\u2022 Must have 6 month to a 1 year proven sale experience\u2022 Candidates must also have the drive and ability to sell a wide portfolio of products.\u2022 All candidates are required to take a company Background and Drug screening\u00a0\u2022 Shift Monday through Friday \u2013 8:00 a.m. \u2013 6:00 p.m. Saturday 8:00am \u2013 5:00pm",
    "location": "US, VA, Hampton",
    "company_name": "Delivering superior customer services for over 10 years, IBEX Global is a business process outsource",
    "salary_min": 0,
    "salary_max": 0,
    "job_type": "full-time",
    "experience_level": "entry",
    "skills_required": null,
    "benefits": "Education Requirements:School Diploma or G.E.D EquivalentBenefits include medical, dental and vision plans, FREE parking, 401k plan, and career advancement opportunities.",
    "remote_ok": true,
    "status": "open",
    "industry": "Telecommunications"
  },
  {
    "title": "CNA/Caregivers needed",
    "description": "Attendant Care agency now hiring experienced caregivers and CNAs. Client is in Paradise Valley area. Shifts needed are listed below so schedule would fall between these days and times: Full and Part time available. You MUST be \u00a0ABSOLUTELY reliable.\u00a0Sunday 6am-6pmMonday 6am-6pmTuesday 6am-6pmWednesday 6am-6pmThursday 6am-6pm",
    "requirements": "Must have at lease 1 year experienceCPR and First AidFingerprint Clearance or ability to getAble to pass background checkValid license with clean driving recordMUST BE VERY COMFORTABLE WITH ASSISTING TRANSFERSMUST be able to lift up to 70 lbs\u00a0Comfortable with bathing, dressing, grooming, cooking, housekeepingMust be okay with small dog and be willing to walk daily",
    "location": "US, AZ, ",
    "company_name": "Company",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "$10 per hour",
    "remote_ok": false,
    "status": "open",
    "industry": null
  },
  {
    "title": "Marketing Manager",
    "description": "Farmigo\u2019s talented team is growing quickly, and we\u2019re hiring a Marketing Manager to help expand our base of members, farmers, and neighborhood leaders. We\u2019re looking for someone who can work with our marketing team to lead high-value cross-functional projects, with a focus on rapid execution and attention to detail.Working with the Head of Marketing, the Marketing Manager will:Oversee and execute various high-impact projects in support of Farmigo\u2019s marketing efforts.Own relationships with several key vendors and consultants.Support the head of marketing in overall budgeting and strategic planning.Lead necessary market research and analysis.Oversee promotions and referral strategies.Contribute heavily to marketing strategy across channels and departments at Farmigo \u2014 content, social, design, video, and analytics.",
    "requirements": "4+ years marketing experience, with strong preference to e-commerce or food related work. \u00a0Exceptionally strong written and communication skills.Strong analytical skills, with proficiency in Excel.Superior project management skills with experience coordinating external resourcesA passion for improving the food system for communities across the country.Bachelor\u2019s degree. (MBA in Marketing preferred.)",
    "location": "US, NY, Brooklyn",
    "company_name": "Farmigo is a mission-driven startup with a simple, ambitious goal: we want to make local, sustainabl",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "We love our staff, and we try to show it with good benefits: equity in a fast-growing start-up, competitive salaries, an amazing culture, and the chance to learn from great co-workers. Plus, you\u2019ll get steep discounts on the best food you\u2019ve ever tasted, and we make an incredible family lunch together every Friday.",
    "remote_ok": false,
    "status": "open",
    "industry": "Marketing and Advertising"
  },
  {
    "title": "Pre-Sales Executive",
    "description": "       Normal  0          false  false  false    EN-US  X-NONE  X-NONE                                                                                                                                                                                                                                                                                                                                                         /* Style Definitions */ #URL_22932ad710cc8bab5012d10e1dc768a71064c391fef21e0fceddb0e7a66f97b6#{mso-style-name:\"Table Normal\";mso-tstyle-rowband-size:0;mso-tstyle-colband-size:0;mso-style-noshow:yes;mso-style-priority:99;mso-style-parent:\"\";mso-padding-alt:0in 5.4pt 0in 5.4pt;mso-para-margin-top:0in;mso-para-margin-right:0in;mso-para-margin-bottom:10.0pt;mso-para-margin-left:0in;line-height:115%;mso-pagination:widow-orphan;font-size:11.0pt;font-family:\"Calibri\",\"sans-serif\";mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:\"Times New Roman\";mso-bidi-theme-font:minor-bidi;}As a Pre-Sales Executive at Upstream, you will have a unique opportunity to work with mobile operators around the world on some of the most innovative mobile marketing solutions. With mobile marketing spend poised to grow to $21.2 billion by 2012 (ABI Research), you will help Upstream to continue its rapid growth. The Pre-Sales position leads to a potential career in sales, product management or account management.You need to be a focused, proactive self-starter who can operate in a team environment and have the ability to work effectively with cross-functional and remote teams. Performance is measured by the delivery of on time goals and with high quality, smooth interaction with the position\u2019s stakeholders and innovation to processes and materials.The role is based in Athens, Greece.   Normal  0          false  false  false    EN-US  X-NONE  X-NONE                                                                                                                                                                                                                                                                                                                                                         /* Style Definitions */ #URL_22932ad710cc8bab5012d10e1dc768a71064c391fef21e0fceddb0e7a66f97b6#{mso-style-name:\"Table Normal\";mso-tstyle-rowband-size:0;mso-tstyle-colband-size:0;mso-style-noshow:yes;mso-style-priority:99;mso-style-parent:\"\";mso-padding-alt:0in 5.4pt 0in 5.4pt;mso-para-margin-top:0in;mso-para-margin-right:0in;mso-para-margin-bottom:10.0pt;mso-para-margin-left:0in;line-height:115%;mso-pagination:widow-orphan;font-size:11.0pt;font-family:\"Calibri\",\"sans-serif\";mso-ascii-font-family:Calibri;mso-ascii-theme-font:minor-latin;mso-hansi-font-family:Calibri;mso-hansi-theme-font:minor-latin;mso-bidi-font-family:\"Times New Roman\";mso-bidi-theme-font:minor-bidi;}Key AccountabilitiesInteract with sales staff to support global sales activitiesModel the financial business case associated with each sales opportunityCreate material that clearly communicates the uniqueness of Upstream\u2019s solutionsAttend sales meetings and present to prospective clientsRepresent Upstream at trade eventsCollect and document competitive intelligenceMaintain the company\u2019s knowledge repository",
    "requirements": "       Normal  0          false  false  false    EN-US  X-NONE  X-NONE                                                                                                                                                                                                                                                                                                                                                        Knowledge/Skills/ExperienceBA/BS degree or equivalent3+ years of experience in mobile marketing, the mobile operator space, or the technology sector.Proficient with numbers and financial models in Microsoft ExcelMust possess a sense of design and proficiency in Microsoft PowerPointExtreme attention to detailWillingness to travelPersonal CharacteristicsBright, ambitious, self-driven, hard-working and flexibleAble to perform under pressure and deliver results in a demanding and fast-paced environment that requires fresh thinking and innovationFluent in EnglishExcellent written and verbal communication skills\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0",
    "location": "Remote",
    "company_name": "Upstream\u2019s mission is to revolutionise the way companies market to consumers through cutting edge te",
    "salary_min": null,
    "salary_max": null,
    "job_type": "full-time",
    "experience_level": "mid",
    "skills_required": null,
    "benefits": "Includes an attractive competitive base salary and benefits, working closely with a highly motivated team in a dynamic and fast paced environment that provides the opportunity for rapid career development.",
    "remote_ok": false,
    "status": "open",
    "industry": "Telecommunications"
  }
];
    
    console.log(`📦 Importing ${jobs.length} jobs...`);
    
    // Add recruiter_id to each job
    const jobsWithRecruiter = jobs.map(job => ({
        ...job,
        recruiter_id: userId
    }));
    
    // Insert jobs
    const { data, error } = await supabase
        .from('jobs')
        .insert(jobsWithRecruiter);
    
    if (error) {
        console.error('❌ Error importing jobs:', error);
    } else {
        console.log('✅ Successfully imported', jobs.length, 'jobs!');
        console.log('🎉 Refresh the page to see new job listings!');
    }
})();
