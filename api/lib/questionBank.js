// Complete Training Assessment Bank — 245 MCQs + 15 Scenarios + 4 Exercises
// Gotravelcc — Multi-Vertical Travel Management Company
// All 6 Pillars | MCQs | Scenarios | Exercises — With Correct Answers & Explanations

export const PILLARS = [
  {
    id: 1,
    title: 'Organization & Business Model',
    certification: 'TMC Business Certified',
    audience: 'ALL Employees',
    passMark: 80,
    timeMinutes: 120,
    modules: [
      {
        id: '1.1',
        title: 'TMC Business Model & Revenue Streams',
        duration: 45,
        questions: [
          {id:1,q:'What does TMC stand for?',o:['Travel Management Company','Tour Management Coordination','Transport Migration Center','Travel Marketing Corporation'],a:0,e:'TMC = Travel Management Company, the standard industry term for a corporate travel agency'},
          {id:2,q:'Which of the following is the PRIMARY revenue source for most TMCs on domestic air tickets?',o:['Commission from airlines','Service fees charged to customers','Markup on fares','Incentive bonuses only'],a:1,e:'Domestic air has minimal commission; service fees are the primary revenue driver'},
          {id:3,q:'What is the typical margin range on air tickets for a TMC?',o:['15-25%','2-8%','30-40%','50-60%'],a:1,e:'Air tickets have thin margins (2-8%); non-air products are more profitable'},
          {id:4,q:'Which product category typically offers the HIGHEST margin for a TMC?',o:['Domestic air tickets','International air tickets','Travel insurance','Budget hotels'],a:2,e:'Insurance can offer 20-35% margin, highest among standard products'},
          {id:5,q:'What is the key difference between Corporate and Retail verticals?',o:['Corporate has higher volume, Retail has higher margin','Corporate operates on credit, Retail requires upfront payment','Corporate sells only air, Retail sells packages','Corporate has no SLAs, Retail has strict SLAs'],a:1,e:'Corporate clients typically have credit terms; Retail must pay before service'},
          {id:6,q:'In the Consolidation (B2B) model, who is the customer?',o:['The end traveller','The corporate company','Travel agents who resell','Airlines directly'],a:2,e:'Consolidation serves travel agents who then service their own customers'},
          {id:7,q:'What is a \'wallet\' in the Consolidation vertical?',o:['A physical payment device','Prepaid credit balance used by agents for bookings','A bank account for refunds','An insurance policy holder'],a:1,e:'Agents maintain prepaid wallet balance from which bookings are deducted'},
          {id:8,q:'Why do SOPs exist in a TMC? Select the BEST answer.',o:['To increase paperwork','To ensure consistency, reduce errors, and enable scaling','To make employees work slower','To satisfy government requirements only'],a:1,e:'SOPs ensure consistent quality, minimize errors, and enable business scaling'},
          {id:9,q:'What happens when margins are consistently below the \'pricing floor\'?',o:['The company grows faster','The business loses money on each transaction','Customers get better service','Airlines increase commission'],a:1,e:'Pricing below cost means losing money - unsustainable business'},
          {id:10,q:'What is \'GMV\' in travel industry context?',o:['Gross Margin Value','Gross Merchandise Value (total booking value)','General Management Volume','Government Mandated Verification'],a:1,e:'GMV = total value of all bookings, before deducting costs'},
          {id:11,q:'Which vertical typically has the FASTEST service expectation?',o:['Corporate','Retail','Consolidation (B2B)','All are the same'],a:2,e:'B2B agents expect responses in minutes; they have their own customers waiting'},
          {id:12,q:'What is \'non-air attach rate\'?',o:['Rate of cancelled air tickets','Percentage of air bookings that include additional products (hotel, visa, insurance)','Rate of non-refundable tickets','Commission on non-air products'],a:1,e:'Attach rate measures cross-sell success - critical for improving blended margins'},
          {id:13,q:'Why is air-only business often unprofitable?',o:['Airlines don\'t pay TMCs','Low margins don\'t cover cost to serve','Air tickets are free','Customers don\'t pay'],a:1,e:'2-5% margin on air often doesn\'t cover operational costs without additional products'},
          {id:14,q:'What is BSP in airline industry?',o:['Booking System Platform','Billing and Settlement Plan','Business Sales Process','Board of Service Providers'],a:1,e:'BSP is IATA\'s payment settlement system between airlines and agents'},
          {id:15,q:'How often does BSP settlement typically occur?',o:['Daily','Weekly or bi-weekly','Monthly','Quarterly'],a:1,e:'BSP settlement is typically weekly, with funds deducted for tickets issued'},
          {id:16,q:'What is the purpose of a \'service fee\' in retail?',o:['To pay airline penalties','To generate revenue and cover operational costs','To discount tickets','To fund marketing'],a:1,e:'Service fees are direct revenue that covers the cost of providing the service'},
          {id:17,q:'In a corporate account, what does \'DSO\' measure?',o:['Daily Sales Output','Days Sales Outstanding (time to collect payment)','Direct Service Operations','Departmental Service Orders'],a:1,e:'DSO measures how long it takes to collect payment - critical for cash flow'},
          {id:18,q:'What is \'cost to serve\' in TMC operations?',o:['Price paid to suppliers','Total cost of processing a transaction (staff time, systems, overhead)','Marketing expenses','Office rent'],a:1,e:'Cost to serve includes all internal costs of handling a booking'},
          {id:19,q:'Which statement about verticals is TRUE?',o:['Corporate vertical has highest transaction speed requirements','Each vertical has different economics, risks, and operational models','Retail vertical has the highest credit risk','Consolidation vertical requires lowest product knowledge'],a:1,e:'Each vertical operates differently and requires tailored approaches'},
          {id:20,q:'What is the \'blended margin\' concept?',o:['Combining profits from all companies','Weighted average margin across all products in a booking','Margin after tax','Commission shared with partners'],a:1,e:'Blended margin improves when high-margin products (insurance, visa) are attached to air'},
        ]
      },
      {
        id: '1.2',
        title: 'Customer Segments & Expectations',
        duration: 30,
        questions: [
          {id:21,q:'What is the PRIMARY concern of a corporate travel buyer?',o:['Getting the cheapest possible fare','Policy compliance, duty of care, and cost control','Earning frequent flyer miles','Booking luxury hotels'],a:1,e:'Corporate buyers focus on policy compliance, traveler safety, and budget management'},
          {id:22,q:'How does a retail leisure customer typically differ from a corporate traveler?',o:['Retail customers have unlimited budgets','Retail customers are more price-sensitive and have flexible dates','Retail customers only book same-day travel','Retail customers don\'t need visas'],a:1,e:'Leisure travelers compare prices more and can often adjust dates for better deals'},
          {id:23,q:'What is \'duty of care\' in corporate travel?',o:['Caring for the booking system','Company\'s obligation to keep employees safe while traveling','Paying travel expenses','Booking first-class tickets'],a:1,e:'Duty of care = legal/ethical responsibility to protect employee safety during travel'},
          {id:24,q:'Why do consolidation agents value SPEED above all?',o:['They get paid per minute','They have their own customers waiting for answers','Airlines require fast booking','Speed reduces ticket prices'],a:1,e:'B2B agents are servicing their own customers - delays cost them business'},
          {id:25,q:'What is typical SLA expectation for Consolidation ticketing response?',o:['Same day','Within 10-15 minutes','Within 24 hours','Within 1 hour'],a:1,e:'B2B agents expect near-instant response - typically 10-15 minute SLA'},
          {id:26,q:'Corporate travel policy typically specifies which of the following?',o:['Preferred airlines, hotel star limits, advance booking requirements','Personal vacation preferences','Employee birthdays','Office parking rules'],a:0,e:'Travel policy covers approved suppliers, booking rules, and expense limits'},
          {id:27,q:'What is a \'MBR\' in corporate account management?',o:['Monthly Business Review','Minimum Booking Requirement','Master Booking Record','Maximum Budget Reserve'],a:0,e:'MBR = Monthly Business Review, regular meeting to review account performance'},
          {id:28,q:'Which segment has the HIGHEST risk of payment fraud?',o:['Corporate with credit terms','Retail with online payments','Consolidation with wallet','Government contracts'],a:1,e:'Retail online payments face highest fraud risk - fake transfers, chargebacks'},
          {id:29,q:'What does \'wallet share\' mean in corporate accounts?',o:['Physical wallet size','Percentage of client\'s total travel spend captured by TMC','Amount of cash payments','Number of travelers'],a:1,e:'Wallet share = % of client\'s travel budget that goes through your TMC'},
          {id:30,q:'Why is customer segmentation important for a TMC?',o:['To discriminate between customers','To tailor service levels, pricing, and processes to each segment\'s needs','To reduce headcount','To avoid certain customers'],a:1,e:'Different segments need different approaches - one size doesn\'t fit all'},
          {id:31,q:'What is the primary KPI for retail sales consultant?',o:['Number of emails sent','Lead to booking conversion rate','Hours worked','Number of coffee breaks'],a:1,e:'Conversion rate measures effectiveness - turning leads into actual bookings'},
          {id:32,q:'How should a corporate AM handle a policy exception request?',o:['Always say no','Document the request, escalate for approval, log the exception','Ignore it','Automatically approve'],a:1,e:'Exceptions require proper documentation, approval, and audit trail'},
          {id:33,q:'What characterizes a \'high-value\' retail customer?',o:['Complaints a lot','High spending, repeat bookings, refers others','Only books air','Lives nearby'],a:1,e:'High-value = revenue + loyalty + referrals'},
          {id:34,q:'In consolidation, what is \'churn\'?',o:['Butter production','Agents who stop booking with you','Fast ticketing','Commission calculation'],a:1,e:'Churn = loss of agents to competitors - critical metric in B2B'},
          {id:35,q:'What is \'CSAT\' used to measure?',o:['Cost savings','Customer Satisfaction Score','Cash settlement amount','Credit score adjustment'],a:1,e:'CSAT = Customer Satisfaction, typically measured via post-service surveys'},
        ],
        scenarios: [
          {id:1,title:'Corporate Policy Conflict',text:'A corporate traveler requests a business class ticket for a 2-hour domestic flight. Company policy allows business class only for flights over 4 hours. The traveler says their VP verbally approved it.',question:'How should you handle this request?',answer:'1) Acknowledge the request professionally. 2) Explain that policy requires documented approval for exceptions. 3) Request the traveler obtain written approval from the VP (email or system approval). 4) Do not proceed without documented exception. 5) Once received, process the booking and log the exception in the system. Never accept verbal approvals for policy exceptions.'},
          {id:2,title:'Price-Sensitive Retail Customer',text:'A retail customer has been comparing your quote with online prices for the past 3 days. They found a similar fare $20 cheaper on an OTA but are worried about support if something goes wrong during travel.',question:'What approach should you take to close this sale?',answer:'1) Don\'t compete on price alone - highlight value. 2) Explain what\'s included: 24/7 support, changes handled for them, travel insurance options, visa assistance. 3) Calculate the cost if they need to change the OTA booking themselves (often $50-100 fees). 4) Offer a small goodwill gesture if appropriate (within your authority). 5) If they still choose OTA, accept gracefully and remain available for future bookings.'},
        ]
      },
      {
        id: '1.3',
        title: 'Vertical Overview & SOP Compliance Culture',
        duration: 25,
        questions: [
          {id:36,q:'What is the main operational difference between Corporate and Consolidation?',o:['Corporate issues tickets, Consolidation doesn\'t','Corporate has credit terms, Consolidation uses prepaid wallet','Corporate only handles air, Consolidation handles all products','There is no difference'],a:1,e:'Corporate = credit-based; Consolidation = prepaid wallet model'},
          {id:37,q:'Why must Retail ALWAYS collect payment before ticketing?',o:['To make customers wait','No credit relationship exists; risk of non-payment is 100%','Airlines require it','It\'s faster'],a:1,e:'Retail has no credit agreement - ticket without payment = potential loss'},
          {id:38,q:'What happens if SOPs are not followed consistently?',o:['Nothing changes','Errors increase, quality varies, audits fail, business is at risk','Customers are happier','Revenue increases'],a:1,e:'Inconsistent processes = inconsistent results, errors, and audit failures'},
          {id:39,q:'Who can modify an SOP?',o:['Anyone who thinks they know better','Only authorized personnel through formal change control','Customers','No one ever'],a:1,e:'SOPs require version control, approval, and communication before changes'},
          {id:40,q:'What is a \'blueprint\' in Zoho?',o:['Building design','Automated workflow that enforces process stages','Report template','Email design'],a:1,e:'Zoho Blueprint enforces stage transitions and required fields automatically'},
          {id:41,q:'Why does Consolidation have faster SLA than Corporate?',o:['Because agents pay more','Because agents have their own customers waiting','Because tickets are simpler','Because there\'s less documentation'],a:1,e:'B2B agents need rapid response as they\'re servicing end customers'},
          {id:42,q:'What role does Finance play in ALL verticals?',o:['Only counting money','Payment verification, fraud prevention, reconciliation, audit trails','Customer service','Ticket pricing'],a:1,e:'Finance is the control function across all verticals'},
          {id:43,q:'What is the consequence of an employee operating \'off-system\'?',o:['Faster service','No audit trail, higher error risk, compliance failure','Better customer experience','Higher revenue'],a:1,e:'Off-system work bypasses controls, creates risks, and breaks audit trails'},
          {id:44,q:'In Retail, what triggers the Operations workflow to begin?',o:['Customer inquiry','Payment verification by Finance','Salesperson request','End of day'],a:1,e:'Ops only proceeds after Finance confirms payment is verified'},
          {id:45,q:'What is the \'handover\' process between Sales and Ops?',o:['Physical document transfer','Complete transfer of booking info via CRM with all required details','Verbal briefing only','Customer does it themselves'],a:1,e:'Handover includes all customer info, preferences, and payment confirmation in system'},
          {id:46,q:'Why is SOP version control important?',o:['To confuse employees','To ensure everyone follows the same current process','To keep old documents','To satisfy IT department'],a:1,e:'Version control ensures one active SOP, preventing confusion and errors'},
          {id:47,q:'What makes Corporate operations more complex than Retail?',o:['Larger offices','Travel policies, approval flows, credit terms, multi-product needs','More colors','Fewer customers'],a:1,e:'Corporate has policy compliance, approvals, and account management requirements'},
          {id:48,q:'What is the purpose of a RACI matrix?',o:['Rating employee performance','Clarifying who is Responsible, Accountable, Consulted, Informed','Calculating revenue','Designing office layouts'],a:1,e:'RACI eliminates confusion about roles and responsibilities'},
          {id:49,q:'What happens at a \'stage gate\' in a process?',o:['Employees take a break','Required conditions must be met before proceeding','Payments are collected','Reports are generated'],a:1,e:'Stage gates enforce prerequisites - can\'t proceed until requirements met'},
          {id:50,q:'How does Zoho enforce process discipline?',o:['By sending reminders','Through mandatory fields, stage requirements, and automated validations','By locking computers','Through email only'],a:1,e:'Zoho blueprints enforce required fields and stage transitions automatically'},
        ],
        scenarios: [
          {id:3,title:'SOP Deviation Request',text:'A senior salesperson wants to skip the Finance payment verification step for a \'trusted regular customer\' to save time. They say they\'ve done it before without problems.',question:'How should this be handled?',answer:'1) Politely but firmly decline to skip the process step. 2) Explain that SOPs exist for consistency, audit compliance, and risk management. 3) Note that \'no problems before\' doesn\'t mean \'no risk\' - controls exist to prevent the exceptions that cause losses. 4) If the process is genuinely inefficient, encourage them to submit a formal process improvement suggestion through proper channels. 5) Never bypass Finance verification regardless of customer history.'},
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Product Mastery (Air + Non-Air)',
    certification: 'Product Specialist',
    audience: 'Sales, Ops, AMs',
    passMark: 80,
    timeMinutes: 150,
    modules: [
      {
        id: '2.1',
        title: 'Air Level 1 — Air Basics & Fare Types',
        duration: 45,
        questions: [
          {id:51,q:'What is a \'published fare\'?',o:['A fare that appears in newspapers','Standard fare filed by airline available to all agents','A discounted fare','A corporate negotiated fare'],a:1,e:'Published fares are standard fares filed in GDS, available to all agencies'},
          {id:52,q:'What does \'non-refundable\' fare mean?',o:['The ticket cannot be changed','No monetary refund if cancelled, though taxes may be refundable','The ticket is free','The fare will increase'],a:1,e:'Non-refundable = no fare refund, but some taxes may still be recoverable'},
          {id:53,q:'What is the difference between \'reissue\' and \'refund\'?',o:['They are the same','Reissue changes the ticket; refund cancels and returns money','Reissue is for hotels; refund is for air','Reissue is faster'],a:1,e:'Reissue = modify existing ticket; Refund = cancel ticket and return funds'},
          {id:54,q:'What is YQ/YR on a ticket?',o:['Year and quarter','Fuel surcharge components','Youth discount','Frequent flyer code'],a:1,e:'YQ and YR are fuel/carrier surcharges added to the base fare'},
          {id:55,q:'What does \'TTL\' stand for in airline context?',o:['Total Ticket Limit','Ticket Time Limit','Travel Time Log','Tax Total Listing'],a:1,e:'TTL = deadline by which a PNR must be ticketed or it will be cancelled'},
          {id:56,q:'What is a \'fare basis code\'?',o:['Airport code','Alphanumeric code identifying specific fare rules and restrictions','Flight number','Booking class only'],a:1,e:'Fare basis identifies the exact fare type with its conditions'},
          {id:57,q:'What is the significance of \'booking class\'?',o:['Cabin type only (economy, business)','Determines fare level, conditions, and inventory availability','Seat assignment','Check-in priority'],a:1,e:'Booking class (Y, B, M, etc.) determines fare rules, not just cabin class'},
          {id:58,q:'What is a \'one-way\' ticket?',o:['A ticket with one destination','Travel from origin to destination only, no return','A ticket for one person','A non-refundable ticket'],a:1,e:'One-way = single direction journey; return requires separate ticket'},
          {id:59,q:'What is \'checked baggage allowance\'?',o:['Bags you can take on board','Weight/pieces of bags stored in cargo hold included in fare','Hand luggage size','Extra bag fees'],a:1,e:'Checked baggage = bags in hold, allowance varies by fare type'},
          {id:60,q:'What is the typical validity period of a standard international ticket?',o:['30 days','1 year from date of first travel','Forever','6 months'],a:1,e:'Standard ticket validity is 1 year from first departure (unless fare rules specify otherwise)'},
          {id:61,q:'What is an \'open-jaw\' itinerary?',o:['A broken ticket','Departure city differs from return arrival city','A round-trip ticket','A one-way ticket'],a:1,e:'Open-jaw: fly into one city, out of another (e.g., LOS-LHR, CDG-LOS)'},
          {id:62,q:'What is minimum connection time (MCT)?',o:['Fastest possible connection','Minimum required time between flights for legal connection','Maximum connection allowed','Average waiting time'],a:1,e:'MCT = minimum time required by airport to make a connection (varies by airport)'},
          {id:63,q:'What happens if a passenger misses their flight due to short connection?',o:['Airline always rebooks free','Depends on whether MCT was met and if same ticket','Passenger must buy new ticket','Nothing happens'],a:1,e:'If on same ticket with legal MCT, airline typically re-accommodates; otherwise passenger responsible'},
          {id:64,q:'What is a \'through fare\'?',o:['A fare for a direct flight','Single fare covering entire multi-sector journey','A connecting flight','A promotional fare'],a:1,e:'Through fare = one fare for entire journey even with connections'},
          {id:65,q:'What is \'fare construction\'?',o:['Building new fares','Calculation method showing how total fare is built (base + taxes)','Airline pricing department','Marketing term'],a:1,e:'Fare construction = breakdown showing origin, destination, fare basis, amount'},
          {id:66,q:'What does \'advance purchase\' requirement mean?',o:['Buying at the airport','Fare must be purchased a specific number of days before departure','Paying extra for early booking','Booking in advance only'],a:1,e:'Advance purchase = fare requires booking X days before travel (e.g., AP14 = 14 days)'},
          {id:67,q:'What is an \'infant\' in airline terminology?',o:['Any child','Child under 2 years traveling without own seat','Child under 12','Teenager'],a:1,e:'Infant = under 2 years, sits on adult\'s lap, typically pays 10% of adult fare'},
          {id:68,q:'What is the typical fare percentage for an infant (under 2)?',o:['50% of adult fare','10% of adult fare','Free','75% of adult fare'],a:1,e:'Infants (lap children) typically pay 10% of adult fare'},
          {id:69,q:'What is \'e-ticket\' vs \'paper ticket\'?',o:['Same thing','E-ticket is electronic record; paper ticket is physical document','E-ticket costs more','Paper ticket is faster'],a:1,e:'E-tickets replaced paper; record stored electronically, itinerary receipt provided'},
          {id:70,q:'What is a \'PNR\'?',o:['Personal Name Record','Passenger Name Record - booking record in GDS','Payment Notice Receipt','Priority Number Registration'],a:1,e:'PNR = reservation record containing all booking details'},
          {id:71,q:'What does \'VOID\' mean in ticketing?',o:['Cancel after 24 hours','Cancel ticket on same day of issue for full refund','Modify the ticket','Upgrade the ticket'],a:1,e:'Void = same-day cancellation, reverses the ticket as if never issued'},
          {id:72,q:'What is \'interline\' vs \'codeshare\'?',o:['Same thing','Interline = agreement between airlines; Codeshare = one flight marketed by multiple airlines','Interline is domestic; codeshare is international','Codeshare is cheaper'],a:1,e:'Interline = ticketing agreement; Codeshare = one physical flight with multiple codes'},
          {id:73,q:'What is IATA in the airline industry?',o:['Insurance and Travel Association','International Air Transport Association','Independent Airline Ticketing Authority','International Airport Travel Authority'],a:1,e:'IATA = industry association that sets standards for airlines and agents'},
          {id:74,q:'What is \'cabin class\'?',o:['Crew area','Service class: Economy, Premium Economy, Business, First','Booking class','Aircraft type'],a:1,e:'Cabin class = physical service section of aircraft'},
          {id:75,q:'What documents should a passenger have for international travel?',o:['Only passport','Valid passport, required visas, and ticket','Only ticket','Driver\'s license'],a:1,e:'International travel requires valid passport (6+ months), visas as required, and ticket'},
        ],
        scenarios: [
          {id:4,title:'Fare Rule Interpretation',text:'A customer booked a promotional fare LOS-LHR for $600. They now want to change their travel date. The fare rules show: Changes permitted - $150 fee plus fare difference. The new date fare is $750.',question:'What is the total cost for the customer to change?',answer:'Total change cost = Change fee ($150) + Fare difference ($750 - $600 = $150) = $300. Customer needs to pay additional $300 to change their ticket. Always check if taxes changed as well - any tax increase also needs to be collected.'},
          {id:5,title:'Ticket Validity Issue',text:'A customer has a ticket issued on March 15, 2025 for travel on April 10, 2025. Due to illness, they couldn\'t travel. They now want to use the ticket on March 20, 2026. The ticket shows fare rules: 1 year validity from issuance.',question:'Can they use this ticket? What should you do?',answer:'The ticket validity is from date of issue, not date of first travel. Issued March 15, 2025 means validity expires March 14, 2026. The requested travel date (March 20, 2026) is AFTER expiry. Options: 1) Check if medical certificate extends validity (some airlines allow). 2) Check if ticket can be reissued before expiry. 3) If expired, ticket value is lost unless airline makes exception.'},
          {id:6,title:'Connecting Flight Risk',text:'Customer wants to book LOS-ADD (2h layover) ADD-DXB. The MCT for Addis Ababa for international connections is 90 minutes. First flight often delays 20-30 minutes.',question:'Should you book this itinerary? What should you advise?',answer:'1) The connection meets minimum legal requirements (2h > 90min MCT). 2) However, recommend a longer connection given known delays. 3) If customer insists, book but document the risk discussion. 4) Ensure both flights on same ticket (protection if misconnect). 5) Never book below MCT regardless of customer request.'},
        ]
      },
      {
        id: '2.4',
        title: 'Hotel Certification',
        duration: 35,
        questions: [
          {id:76,q:'What is a \'room night\'?',o:['Evening entertainment','One room for one night - basic hotel inventory unit','Late check-in','Room service hours'],a:1,e:'Room night = unit of hotel inventory; 1 room x 1 night'},
          {id:77,q:'What is \'rack rate\'?',o:['Lowest available rate','Published standard rate before any discounts','Commission rate','Tax rate'],a:1,e:'Rack rate = full price; actual rates are usually discounted from this'},
          {id:78,q:'What is the difference between \'refundable\' and \'non-refundable\' hotel rates?',o:['Quality of room','Non-refundable is cheaper but no cancellation refund','Location in hotel','Meal inclusion'],a:1,e:'Non-refundable offers lower rate in exchange for cancellation flexibility'},
          {id:79,q:'What is \'CXL\' deadline?',o:['Check-out time','Cancellation deadline before penalties apply','Credit card expiry','Confirmation deadline'],a:1,e:'CXL deadline = last moment to cancel without penalty'},
          {id:80,q:'What is a \'no-show\' in hotel context?',o:['Empty room','Guest doesn\'t arrive and doesn\'t cancel - full penalty charged','Cancelled booking','Late arrival'],a:1,e:'No-show = failure to arrive; typically full first night charged'},
          {id:81,q:'What does \'RO\' mean in hotel rates?',o:['Room Only - no meals included','Reservation Optional','Rate Override','Room Occupied'],a:0,e:'RO = Room Only, as opposed to BB (Bed & Breakfast) or HB (Half Board)'},
          {id:82,q:'What is \'BB\' in hotel meal plans?',o:['Best Booking','Bed and Breakfast - room plus breakfast','Business Booking','Budget Basic'],a:1,e:'BB = Bed and Breakfast, includes room and morning meal'},
          {id:83,q:'What is the typical hotel commission for a TMC?',o:['30-40%','8-15%','1-2%','50%'],a:1,e:'Hotel commissions typically range 8-15% depending on relationship'},
          {id:84,q:'What is a \'voucher\' in hotel booking?',o:['Discount coupon','Confirmation document given to guest proving booking','Payment receipt','Hotel brochure'],a:1,e:'Voucher = official confirmation document presented at check-in'},
          {id:85,q:'What should you verify before confirming a hotel booking?',o:['Hotel star rating only','Dates, rate, room type, meal plan, cancellation policy, payment terms','Distance from airport','Reviews only'],a:1,e:'Complete verification prevents errors and customer complaints'},
          {id:86,q:'What is \'overbooking\' in hotels?',o:['Too many amenities','Accepting more reservations than available rooms','Extra charges','Multiple bookings by same guest'],a:1,e:'Overbooking is hotel revenue management practice; can result in \'walking\' guests'},
          {id:87,q:'What happens when a guest is \'walked\'?',o:['They go for a walk','Moved to another hotel due to overbooking - hotel pays costs','Upgraded','Check-out is delayed'],a:1,e:'Walked guest gets accommodated elsewhere at hotel\'s expense'},
          {id:88,q:'What is \'early check-in\' and \'late check-out\'?',o:['Standard timing','Arrival before/departure after standard times - may have extra cost','Express service','Member benefits only'],a:1,e:'Standard check-in usually 2-3PM, check-out 11AM-12PM; deviations may cost extra'},
          {id:89,q:'Why must hotel bookings include guest passport name?',o:['For decoration','Hotel registration requires matching ID at check-in','For marketing','Not necessary'],a:1,e:'Hotel registration laws require ID match - wrong name can mean denied check-in'},
          {id:90,q:'What is a \'contracted rate\'?',o:['Any available rate','Negotiated rate between TMC and hotel with guaranteed pricing','Walk-in rate','Last-minute rate'],a:1,e:'Contracted rates are pre-negotiated, often with benefits and commissions'},
          {id:91,q:'What documentation is needed for a hotel refund claim?',o:['Verbal request','Booking confirmation, cancellation confirmation, timeline proof','Just an email','Nothing needed'],a:1,e:'Refund requires documented proof of cancellation within policy'},
          {id:92,q:'What is \'HB\' meal plan?',o:['Heavy Breakfast','Half Board - breakfast and one other meal (usually dinner)','Hotel Booking','High Budget'],a:1,e:'HB = Half Board, typically includes breakfast and dinner'},
          {id:93,q:'What is \'FB\' meal plan?',o:['Full Breakfast','Full Board - breakfast, lunch, and dinner','Free Booking','First Best'],a:1,e:'FB = Full Board, all three meals included'},
          {id:94,q:'Why is cancellation deadline important to communicate?',o:['It\'s not important','Guest may lose full payment if cancelling after deadline','For hotel statistics','Marketing purposes'],a:1,e:'Missing cancellation deadline = financial penalty for guest'},
          {id:95,q:'What is the first step if guest complains room is different than booked?',o:['Tell them to deal with it','Contact hotel immediately, document the issue, seek solution','Offer refund without verification','Ignore complaint'],a:1,e:'Immediate escalation to hotel, documentation, and resolution attempt'},
        ]
      },
      {
        id: '2.5',
        title: 'Visa Certification',
        duration: 35,
        questions: [
          {id:96,q:'What is TIMATIC?',o:['Timing system','Database of visa and passport requirements by nationality and destination','Travel insurance','Airline reservation system'],a:1,e:'TIMATIC = authoritative source for travel document requirements'},
          {id:97,q:'What is a \'visa on arrival\'?',o:['Pre-approved visa','Visa obtained at destination airport upon arrival','Transit visa','Emergency visa'],a:1,e:'VOA = visa issued at port of entry, often for tourism'},
          {id:98,q:'What is a \'Schengen visa\'?',o:['Single-entry German visa','Visa valid for travel within Schengen Area (26 European countries)','Multiple passport visa','Airport transit visa'],a:1,e:'Schengen visa allows travel in 26 European countries with one visa'},
          {id:99,q:'What is the minimum passport validity required by most countries?',o:['3 months','6 months beyond travel dates','1 year','Until return date only'],a:1,e:'Most countries require 6 months passport validity beyond stay'},
          {id:100,q:'What is an \'invitation letter\' for visa?',o:['Hotel booking','Letter from host/company in destination country supporting visa application','Flight ticket','Insurance document'],a:1,e:'Invitation letter from host supports purpose of travel and accommodation'},
          {id:101,q:'What is \'visa rejection\' impact for customer?',o:['Just apply again','Loss of visa fee, possible impact on future applications, trip cancelled','No impact','Automatic approval next time'],a:1,e:'Rejection = fee lost + potential flag in system + trip disruption'},
          {id:102,q:'What documents are typically required for tourist visa?',o:['Passport only','Passport, photos, itinerary, financial proof, accommodation, travel insurance','Just application form','Birth certificate'],a:1,e:'Standard requirements include identity, purpose, financial means, and return intent'},
          {id:103,q:'What is \'biometric\' in visa process?',o:['Biological study','Fingerprint and photo capture for identity verification','Medical test','Background check'],a:1,e:'Biometrics = fingerprints and facial photos stored digitally'},
          {id:104,q:'What is a \'transit visa\'?',o:['Full travel visa','Visa for passing through a country without staying','Multiple entry visa','Student visa'],a:1,e:'Transit visa allows passage through a country during connection'},
          {id:105,q:'Why should TMC staff verify visa requirements BEFORE ticketing?',o:['For interest','To ensure customer can actually enter destination country','To sell visa services','It\'s optional'],a:1,e:'Issuing ticket without visa feasibility = potential denied boarding and complaints'},
          {id:106,q:'What is \'VFS\' in visa processing?',o:['Very Fast Service','Visa Facilitation Services - outsourced application centers','Visa Fee Structure','Virtual Filing System'],a:1,e:'VFS = private company handling visa applications for embassies'},
          {id:107,q:'What is \'embassy fee\' vs \'service fee\'?',o:['Same thing','Embassy fee goes to government; service fee is TMC\'s charge','Embassy fee is higher','Service fee goes to embassy'],a:1,e:'Embassy fee = visa processing by government; Service fee = TMC handling charge'},
          {id:108,q:'What happens if customer provides fake documents for visa?',o:['Nothing','Rejection, possible ban, potential legal consequences','Faster processing','Higher approval chance'],a:1,e:'Fraudulent documents = serious consequences including bans'},
          {id:109,q:'What is \'visa validity\' vs \'permitted stay\'?',o:['Same thing','Validity = when you can enter; Permitted stay = how long you can stay','Validity is longer','Stay is longer'],a:1,e:'6-month validity with 30-day stay = must enter within 6 months, stay max 30 days'},
          {id:110,q:'What should you do if customer\'s visa is rejected?',o:['Nothing','Understand reason, advise on reapplication, handle ticket refund/change','Blame embassy','Ignore'],a:1,e:'Support customer with understanding rejection and next steps'},
        ]
      },
      {
        id: '2.6',
        title: 'Insurance, Car Rental & DMC Packages',
        duration: 25,
        questions: [
          {id:111,q:'What does travel insurance typically cover?',o:['Only lost luggage','Medical emergencies, trip cancellation, lost baggage, delays','Only flight cancellation','Only hotel issues'],a:1,e:'Comprehensive coverage includes medical, cancellation, baggage, and delays'},
          {id:112,q:'What is \'pre-existing condition\' in travel insurance?',o:['New illness','Medical condition existing before policy purchase - often excluded','Travel experience','Previous trips'],a:1,e:'Pre-existing conditions may not be covered unless declared and approved'},
          {id:113,q:'Why is travel insurance margin high for TMC?',o:['Insurance is expensive','Commission rates are 20-35% with minimal operational cost','Customers don\'t want it','It takes long to process'],a:1,e:'Insurance offers excellent margin with simple issuance process'},
          {id:114,q:'What is a \'CDW\' in car rental?',o:['Customer Driver Warranty','Collision Damage Waiver - coverage for vehicle damage','Car Delivery Window','Customer Deposit Waiver'],a:1,e:'CDW reduces renter\'s liability for damage to rental vehicle'},
          {id:115,q:'What documents are needed for international car rental?',o:['Just credit card','Valid license, International Driving Permit (some countries), passport, credit card','Passport only','Local license only'],a:1,e:'International rental requires proper documentation including IDP where required'},
          {id:116,q:'What is a \'DMC\'?',o:['Digital Marketing Company','Destination Management Company - local ground services provider','Driver Management Center','Discount Marketing Code'],a:1,e:'DMC provides local services: transfers, tours, guides, activities'},
          {id:117,q:'What should be confirmed with DMC before booking?',o:['Weather only','Services, inclusions, exclusions, timing, meeting points, emergency contacts','Company history','Social media presence'],a:1,e:'Complete service specification prevents on-ground issues'},
          {id:118,q:'What is \'SIC\' tour vs \'PVT\' tour?',o:['Same thing','Seat-In-Coach (shared) vs Private (exclusive)','Single vs Multiple','Short vs Long'],a:1,e:'SIC = shared with others; PVT = exclusive vehicle/guide for your guests'},
          {id:119,q:'What is typical DMC payment terms?',o:['100% after travel','Deposit before (50-100%) with balance before arrival','No payment needed','Only commission'],a:1,e:'DMC typically requires advance payment given local arrangements needed'},
          {id:120,q:'Why is DMC margin potentially higher than air?',o:['Less work','Markups on packages are set by TMC, not regulated like air','DMC services are free','Airlines don\'t pay commission'],a:1,e:'DMC allows markup flexibility unlike regulated air pricing'},
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Vertical Specialization',
    certification: 'Vertical Specialist',
    audience: 'Role-Specific',
    passMark: 80,
    timeMinutes: 120,
    modules: [
      {
        id: '3.1',
        title: 'Retail Vertical — Sales & Customer Psychology',
        duration: 45,
        questions: [
          {id:121,q:'What is the FIRST response target for retail lead inquiry?',o:['Same day','Within 2 minutes','Within 1 hour','Next business day'],a:1,e:'Retail leads require immediate response - 2 minute SLA'},
          {id:122,q:'Why is retail customer \'payment before service\' non-negotiable?',o:['Company policy','No credit relationship exists - issuing without payment = risk of loss','Faster processing','Customer preference'],a:1,e:'Retail has no credit terms - services without payment = unrecoverable loss'},
          {id:123,q:'What is \'objection handling\' in retail sales?',o:['Rejecting customers','Responding to customer concerns to move toward sale','Filing complaints','Quality control'],a:1,e:'Objection handling = addressing price, timing, or other concerns professionally'},
          {id:124,q:'What is \'upselling\' in retail context?',o:['Overcharging','Offering higher-value product or additional services','Discounting','Fast selling'],a:1,e:'Upselling = suggesting upgrades (better hotel) or add-ons (insurance)'},
          {id:125,q:'What is target non-air attach rate for retail?',o:['10%','45% or higher','100%','5%'],a:1,e:'Target 45%+ of air bookings should include hotel, visa, insurance, etc.'},
          {id:126,q:'How should you handle a retail customer comparing OTA prices?',o:['Match the lowest price','Highlight value: support, flexibility, package benefits','Refuse to quote','Criticize OTAs'],a:1,e:'Compete on value, not just price - emphasize service and support'},
          {id:127,q:'What is a \'lead\' in retail sales?',o:['Any person','Potential customer who has expressed interest in travel services','Existing customer only','Employee'],a:1,e:'Lead = prospect who has inquired or shown interest'},
          {id:128,q:'What is \'conversion rate\'?',o:['Currency exchange','Percentage of leads that become actual bookings','Speed of service','Customer satisfaction'],a:1,e:'Conversion = leads converted to sales / total leads'},
          {id:129,q:'Why document every customer interaction?',o:['To waste time','For continuity, audit trail, and dispute resolution','Company likes paperwork','Government requirement only'],a:1,e:'Documentation ensures continuity and provides evidence if disputes arise'},
          {id:130,q:'What is the retail finance model?',o:['Credit-based','Zero-credit: 100% payment before any service','Partial payment allowed','Post-travel billing'],a:1,e:'Retail = prepaid model, no credit extended'},
        ]
      },
      {
        id: '3.3',
        title: 'Corporate Vertical — Sales & Account Management',
        duration: 45,
        questions: [
          {id:131,q:'What is an \'RFP\' in corporate sales?',o:['Ready For Payment','Request for Proposal - formal tender process','Retail Fare Price','Refund Processing Form'],a:1,e:'RFP = formal document requesting pricing and service proposals'},
          {id:132,q:'What is \'travel policy\' in corporate context?',o:['Government regulation','Company rules governing employee travel (class, budget, approvals)','Insurance policy','Marketing policy'],a:1,e:'Travel policy = company\'s rules for what/how employees can book'},
          {id:133,q:'What is \'policy compliance rate\'?',o:['Employee attendance','Percentage of bookings adhering to company travel policy','Revenue percentage','Commission rate'],a:1,e:'Compliance = bookings within policy vs total bookings'},
          {id:134,q:'What is the role of Account Manager (AM)?',o:['Just billing','Own client relationship, drive retention, ensure satisfaction, grow revenue','Only handle complaints','Manage office accounts'],a:1,e:'AM = full relationship owner, not just service delivery'},
          {id:135,q:'What is a \'QBR\' in corporate account management?',o:['Quick Booking Request','Quarterly Business Review - regular performance review meeting','Quality Based Rating','Query Based Report'],a:1,e:'QBR = formal review of account performance, issues, opportunities'},
        ]
      },
      {
        id: '3.5',
        title: 'Consolidation Vertical — Agent Management & Operations',
        duration: 40,
        questions: [
          {id:136,q:'What is agent \'wallet\' in consolidation?',o:['Physical wallet','Prepaid balance from which bookings are deducted','Commission account','Savings account'],a:1,e:'Wallet = prepaid deposit that agent uses for bookings'},
          {id:137,q:'Why is speed critical in consolidation?',o:['Agents are impatient','Agents have their own customers waiting for answers','Airlines require fast booking','It\'s not important'],a:1,e:'B2B agents are servicing end customers who are waiting'},
          {id:138,q:'What is \'nett fare\' vs \'published fare\' for agents?',o:['Same thing','Nett = agent cost price; Published = market rate','Nett is higher','Published is agent rate'],a:1,e:'Nett fare = what agent pays; they add markup for their customer'},
          {id:139,q:'What is agent \'onboarding\'?',o:['Hiring','Process of setting up new agent: KYC, wallet, training, activation','Training only','Payment collection'],a:1,e:'Onboarding = complete setup from KYC to active trading'},
          {id:140,q:'Why can wallet NEVER go negative?',o:['It\'s impossible technically','No credit relationship - negative wallet = unrecoverable loss','Agents prefer it','Banking regulation'],a:1,e:'Negative wallet = providing service without payment = loss'},
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Systems Certification (Zoho + GDS)',
    certification: 'Systems Certified',
    audience: 'All System Users',
    passMark: 80,
    timeMinutes: 180,
    modules: [
      {
        id: '4.1',
        title: 'Zoho CRM — Lead & Deal Management',
        duration: 40,
        questions: [
          {id:141,q:'What is a \'Lead\' in Zoho CRM?',o:['Any contact','Potential customer before qualification and conversion','Existing customer','Supplier'],a:1,e:'Lead = prospect; converts to Contact + Account + Deal when qualified'},
          {id:142,q:'What is a \'Deal\' in Zoho CRM?',o:['Any transaction','Revenue opportunity being tracked through pipeline','Customer complaint','Product listing'],a:1,e:'Deal = opportunity with expected value being worked through stages'},
          {id:143,q:'What is \'pipeline\' in CRM context?',o:['Plumbing','Visual representation of deals at various sales stages','Communication channel','Report type'],a:1,e:'Pipeline shows deals flowing through stages: New → Qualified → Won/Lost'},
          {id:144,q:'What happens at \'Payment Received\' stage in CRM?',o:['Nothing special','Finance verification required; price lock activates','Deal is lost','Lead is created'],a:1,e:'Finance gate + price lock ensures no changes after payment confirmation'},
          {id:145,q:'What is \'price locking\' in Zoho CRM?',o:['Negotiation tactic','Preventing price edits after payment verified','Setting minimum prices','Competitor analysis'],a:1,e:'Price lock = no modifications to pricing after Finance confirms payment'},
          {id:146,q:'Who can unlock a price-locked deal?',o:['Anyone','Manager with documented approval','Customer request','No one ever'],a:1,e:'Manager override with audit trail and business justification'},
          {id:147,q:'What are \'mandatory fields\' in CRM?',o:['Optional information','Required data that must be entered before proceeding','System settings','Report filters'],a:1,e:'Mandatory fields enforce data quality at each stage'},
          {id:148,q:'What is \'Blueprint\' in Zoho?',o:['Design template','Automated workflow enforcing process stages and requirements','Report format','User interface'],a:1,e:'Blueprint = process automation with stage gates and validations'},
          {id:149,q:'What triggers auto-creation of Zoho Desk ticket from CRM?',o:['Manual request','Deal conversion to \'Payment Received\' or \'Converted\'','Customer complaint','Monthly schedule'],a:1,e:'Automation creates Ops ticket when deal moves to execution stage'},
          {id:150,q:'Why is CRM data quality important?',o:['For decoration','Enables reporting, forecasting, handovers, and audit compliance','Management preference','IT requirement'],a:1,e:'Quality data drives decisions, enables continuity, and supports audits'},
        ]
      },
      {
        id: '4.3',
        title: 'Zoho Desk — Ticket Management & SLA',
        duration: 40,
        questions: [
          {id:151,q:'What is a \'ticket\' in Zoho Desk?',o:['Movie pass','Service request or task being tracked through resolution','Payment document','Marketing email'],a:1,e:'Ticket = individual work item tracked through completion'},
          {id:152,q:'What is \'SLA\' in Desk context?',o:['Sales Level Achievement','Service Level Agreement - response and resolution time targets','System Logging Application','Standard Limit Adjustment'],a:1,e:'SLA = contractual time commitments for response and resolution'},
          {id:153,q:'What does SLA timer measure?',o:['Agent working hours','Time elapsed since ticket creation toward response/resolution','Customer satisfaction','Revenue'],a:1,e:'SLA timer tracks time toward contractual commitments'},
          {id:154,q:'What happens when SLA reaches 80%?',o:['Nothing','Yellow warning - action needed soon','Ticket closes','Customer is notified'],a:1,e:'80% = warning indicator that deadline is approaching'},
          {id:155,q:'What happens when SLA is breached (100%)?',o:['Nothing','Red flag, auto-escalation to manager, logged as breach','Extra commission','Ticket closes'],a:1,e:'Breach triggers escalation and impacts KPI reporting'},
          {id:156,q:'What is difference between \'Internal Notes\' and \'Customer Notes\'?',o:['Same thing','Internal = staff only; Customer = visible to and sent to customer','Internal is longer','Customer is mandatory'],a:1,e:'Never put internal details in customer-facing communication'},
          {id:157,q:'What should NEVER appear in Customer Notes?',o:['Greeting','Blame, internal processes, technical jargon, or negative language','Solutions','Timeline'],a:1,e:'Customer notes should be professional, solution-focused, clear'},
          {id:158,q:'What is \'escalation\' in Zoho Desk?',o:['Volume increase','Moving ticket to higher authority when needed','Customer anger','Closing ticket'],a:1,e:'Escalation = involving senior staff for resolution assistance'},
          {id:159,q:'When is escalation mandatory?',o:['When you want','Missed flight, stranded traveler, social media complaint, legal threat','End of day','Customer requests'],a:1,e:'Critical situations require immediate escalation regardless of SLA'},
          {id:160,q:'What must be done before closing a ticket?',o:['Nothing','Resolution confirmed, documentation complete, customer acknowledged','Print it','Send to archive'],a:1,e:'Complete documentation and confirmation before closure'},
        ]
      },
      {
        id: '4.7',
        title: 'GDS — Navigation, Commands & Ticketing',
        duration: 45,
        questions: [
          {id:161,q:'What does GDS stand for?',o:['Global Distribution System','General Domestic Service','Ground Delivery System','Government Data System'],a:0,e:'GDS = computerized network for airline/hotel/car reservations'},
          {id:162,q:'What are the main GDS systems?',o:['Only Amadeus','Amadeus, Sabre, Galileo/Travelport','Google and Bing','Zoho systems'],a:1,e:'Three major GDS: Amadeus, Sabre, Galileo (Travelport)'},
          {id:163,q:'What command displays flight availability in Amadeus?',o:['FXP','AN (Availability Neutral)','RT','TTP'],a:1,e:'AN = display available flights between city pairs'},
          {id:164,q:'What command displays a PNR in Amadeus?',o:['AN','RT (Retrieve)','FXP','ET'],a:1,e:'RT = retrieve/display existing PNR'},
          {id:165,q:'What command prices an itinerary in Amadeus?',o:['RT','FXP (Fare Quote Pricing)','AN','TTP'],a:1,e:'FXP = calculate and display fare for itinerary'},
          {id:166,q:'What command issues a ticket in Amadeus?',o:['FXP','TTP (Ticket The PNR)','RT','IG'],a:1,e:'TTP = issue e-ticket from stored fare'},
          {id:167,q:'What does \'IG\' command do in Amadeus?',o:['Issue ticket','Ignore/cancel current work without saving','Get information','Generate report'],a:1,e:'IG = ignore/abandon current transaction'},
          {id:168,q:'What is \'CAT 15\' in fare rules?',o:['Flight category','Penalties (changes and refunds)','Commission','Baggage'],a:1,e:'CAT 15 = penalty rules for changes and cancellations'},
          {id:169,q:'What is \'CAT 16\' in fare rules?',o:['Changes','No-show penalties','Advance purchase','Seasonality'],a:1,e:'CAT 16 = penalties for no-show (not appearing for flight)'},
          {id:170,q:'What are mandatory PNR elements?',o:['Just passenger name','Name, phone, ticketing, itinerary, received from','Only flight','Address'],a:1,e:'All 5 elements required for valid PNR'},
          {id:171,q:'What is \'SSR\' in PNR?',o:['System Service Request','Special Service Request (meals, wheelchair, etc.)','Standard Service Rate','Seat Selection Required'],a:1,e:'SSR = special requests like VGML (vegetarian), WCHR (wheelchair)'},
          {id:172,q:'What is \'OSI\' in PNR?',o:['Operating System Information','Other Service Information (free-text notes to airline)','Original Service Issue','Onward Service Itinerary'],a:1,e:'OSI = informational text passed to airline'},
          {id:173,q:'What should you check before ticketing? (Most important)',o:['Weather','Name matches passport, fare is current, QC checklist complete','Hotel availability','Customer credit score'],a:1,e:'Name accuracy, fare validity, and QC completion prevent ADMs'},
          {id:174,q:'What is \'TTL\' in PNR?',o:['Total Travel Length','Ticket Time Limit - deadline for issuing ticket','Travel Transaction Log','Ticketing Table List'],a:1,e:'TTL = deadline; miss it and PNR is auto-cancelled'},
          {id:175,q:'What happens if TTL expires?',o:['Nothing','PNR and segments are cancelled by airline','Fare decreases','Automatic ticketing'],a:1,e:'TTL expiry = loss of booking, must start over'},
          {id:176,q:'What is \'reissue\' command in Amadeus?',o:['RT','TTP/EXCH or similar exchange commands','FXP','IG'],a:1,e:'Reissue involves exchange commands to modify existing ticket'},
          {id:177,q:'What is \'FQD\' command?',o:['Frequent Question Display','Fare Quote Display - display fare rules','Flight Query Details','File Quick Delete'],a:1,e:'FQD = display applicable fare rules'},
          {id:178,q:'What is a \'fare calculation line\'?',o:['Price calculator','Linear display of fare construction on ticket','Commission calculation','Tax breakdown'],a:1,e:'Fare calc = routing and fare breakdown shown on ticket'},
          {id:179,q:'What must be verified after ticketing?',o:['Nothing','Ticket number, fare calc, taxes, passenger details, itinerary','Weather','Customer address'],a:1,e:'Post-ticketing verification catches errors before customer travel'},
          {id:180,q:'What is \'void\' window typically?',o:['1 week','Same calendar day (until midnight)','24 hours','1 hour'],a:1,e:'Void usually available until midnight local time of issuance'},
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Role-Based Functional Training',
    certification: 'Role Certified',
    audience: 'Sales, Ops, Finance',
    passMark: 80,
    timeMinutes: 120,
    modules: [
      {
        id: '5.1',
        title: 'Sales — Discovery, Pricing & Handover',
        duration: 35,
        questions: [
          {id:181,q:'What is \'discovery\' in sales?',o:['Finding new leads','Understanding customer needs through questioning','Checking availability','Sending quotes'],a:1,e:'Discovery = learning what customer truly needs'},
          {id:182,q:'What does SPIN stand for in discovery?',o:['Sales Process Integration Network','Situation, Problem, Implication, Need-Payoff','Speed, Price, Interest, Negotiation','Service, Product, Information, Next-steps'],a:1,e:'SPIN = questioning framework for effective discovery'},
          {id:183,q:'What is \'pricing floor\'?',o:['Lowest market price','Minimum price below which deal loses money','Competitor price','Customer budget'],a:1,e:'Floor = cost to serve + risk buffer + minimum margin'},
          {id:184,q:'What should happen if quote is below pricing floor?',o:['Proceed anyway','Require manager approval with documented justification','Reject customer','Increase price secretly'],a:1,e:'Below-floor pricing needs approval and audit trail'},
          {id:185,q:'What is \'handover quality\'?',o:['Speed of transfer','Completeness and accuracy of information passed to Ops','Customer satisfaction','Documentation quantity'],a:1,e:'Good handover = Ops has everything needed without asking questions'},
          {id:186,q:'What is target handover quality score?',o:['50%','95% or higher','70%','100% always'],a:1,e:'Target 95%+ completeness; below 70% should be rejected'},
          {id:187,q:'What must be included in retail handover?',o:['Customer name only','Contact details, passport copies, payment confirmation, quote, special requests','Just the booking','Email thread'],a:1,e:'Complete handover prevents Ops errors and delays'},
          {id:188,q:'Why is margin awareness important for sales?',o:['For commission calculation','To ensure deals are profitable and cross-sell high-margin products','For marketing','Not important'],a:1,e:'Sales must understand economics to make profitable decisions'},
          {id:189,q:'What is blended margin?',o:['Average of all margins','Weighted margin across products in a booking','Commission rate','Discount percentage'],a:1,e:'Blended margin improves when high-margin products are attached'},
          {id:190,q:'How should price objections be handled?',o:['Match competitor immediately','Highlight value, explain inclusions, offer alternatives','Refuse to negotiate','Walk away'],a:1,e:'Focus on value proposition, not price matching'},
        ]
      },
      {
        id: '5.4',
        title: 'Operations — QC, SLA & Error Accountability',
        duration: 40,
        questions: [
          {id:191,q:'What is QC discipline?',o:['Quality checking sometimes','Mandatory verification at every step before proceeding','Optional review','Post-service check'],a:1,e:'QC discipline = never skip verification steps'},
          {id:192,q:'How many points on pre-ticketing QC checklist?',o:['5','10','15','20'],a:1,e:'10-point QC checklist covers all critical verification areas'},
          {id:193,q:'What is QC point #1?',o:['Fare check','Name matches passport EXACTLY','Payment verified','TTL checked'],a:1,e:'Name accuracy is first and most critical check'},
          {id:194,q:'What is SLA ownership?',o:['Company owns SLA','YOU are personally responsible for meeting SLA on your tickets','Team responsibility','Customer\'s problem'],a:1,e:'Individual accountability for SLA on assigned tickets'},
          {id:195,q:'How often should you check your ticket queue?',o:['Once an hour','Every 5 minutes','Twice a day','When notified'],a:1,e:'Frequent queue checks prevent SLA breaches'},
          {id:196,q:'What should you do if SLA breach is imminent?',o:['Wait and see','Escalate to Team Lead immediately BEFORE breach','Ignore it','Close the ticket'],a:1,e:'Proactive escalation prevents breach and enables help'},
          {id:197,q:'What is \'error accountability\'?',o:['Blaming others','Owning your mistakes, learning from them, contributing to improvement','Hiding errors','Denying responsibility'],a:1,e:'Accountability = own it, fix it, learn from it'},
          {id:198,q:'What is target error rate?',o:['5%','Less than 0.5% (1 error per 200 transactions)','1%','0%'],a:1,e:'Target < 0.5%; above 1% triggers retraining'},
          {id:199,q:'What is documentation hygiene?',o:['Clean desk','Complete, accurate, timely recording of all actions and evidence','Filing papers','Email management'],a:1,e:'Documentation hygiene = complete audit trail'},
          {id:200,q:'What must every ticket contain?',o:['Customer name only','Customer confirmation, fare rules, QC checklist, PNR, all communications','Just booking reference','Price only'],a:1,e:'Complete documentation protects against disputes and audits'},
        ]
      },
      {
        id: '5.7',
        title: 'Finance — Payment Verification, Fraud & Reconciliation',
        duration: 35,
        questions: [
          {id:201,q:'What is the primary rule of payment verification?',o:['Screenshots are acceptable','Only bank/gateway confirmation is valid; screenshots are NOT proof','Customer word is enough','Any document works'],a:1,e:'Screenshots can be faked; only source confirmation is valid'},
          {id:202,q:'What should you do if payment doesn\'t match?',o:['Proceed anyway','Hold processing, investigate, request clarification','Assume it\'s correct','Ignore difference'],a:1,e:'Mismatches require investigation before proceeding'},
          {id:203,q:'What is a payment verification red flag?',o:['Normal bank transfer','Blurry screenshot, edited document, urgent pressure without payment','Gateway confirmation','Bank statement entry'],a:1,e:'Red flags indicate potential fraud requiring extra scrutiny'},
          {id:204,q:'What is \'chargeback\'?',o:['Extra payment','Customer disputes charge with bank, money reversed from merchant','Refund request','Commission deduction'],a:1,e:'Chargeback = customer disputes transaction; money taken back'},
          {id:205,q:'What is target chargeback ratio?',o:['5%','Less than 0.5%','1%','Any is acceptable'],a:1,e:'High chargeback ratio indicates fraud or service issues'},
          {id:206,q:'What is daily reconciliation?',o:['Annual process','Matching bank/gateway records with system records every day','Monthly task','Customer communication'],a:1,e:'Daily recon catches discrepancies early'},
          {id:207,q:'What is \'audit trail\'?',o:['Walking path','Complete chronological record of who did what, when, why','Report archive','Email folder'],a:1,e:'Audit trail enables verification of every action'},
          {id:208,q:'What audit red flag should be avoided?',o:['Documented approvals','Manual overrides without documentation','Proper receipts','System logs'],a:1,e:'Undocumented overrides suggest potential compliance issues'},
          {id:209,q:'How long should financial records be retained?',o:['1 year','7 years','3 years','Forever'],a:1,e:'7 years is standard legal/tax requirement'},
          {id:210,q:'What is BSP reconciliation?',o:['Daily cash count','Matching airline ticketing report with internal records','Customer billing','Supplier payment'],a:1,e:'BSP recon ensures ticket sales match airline records'},
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Quality, Risk & Compliance',
    certification: 'Compliance Certified',
    audience: 'ALL Employees',
    passMark: 80,
    timeMinutes: 100,
    modules: [
      {
        id: '6.1',
        title: 'ADM Prevention & Appeal Process',
        duration: 40,
        questions: [
          {id:211,q:'What is an ADM?',o:['Additional Discount Memo','Airline Debit Memo - financial penalty from airline','Agent Distribution Method','Automated Delivery Message'],a:1,e:'ADM = penalty deducted from BSP for ticketing violations'},
          {id:212,q:'What is the most common cause of ADM?',o:['Fare errors','Name mismatch between ticket and passport','Commission issues','System errors'],a:1,e:'Name mismatches are the #1 ADM cause'},
          {id:213,q:'What is acceptable name format on ticket?',o:['Nickname','Exactly as shown on passport, character by character','First name only','Title + first name'],a:1,e:'Exact passport match - no variations, nicknames, or titles unless on passport'},
          {id:214,q:'What is target ADM rate?',o:['5%','Less than 0.5% of tickets','1%','2%'],a:1,e:'Industry standard is < 0.5% ADM rate'},
          {id:215,q:'What causes fare/pricing ADM?',o:['Correct pricing','Using expired fare, wrong tax calculation, incorrect fare basis','Customer request','Airline mistake only'],a:1,e:'Fare ADMs result from using invalid or incorrect pricing'},
          {id:216,q:'What is TTL ADM?',o:['Travel Time Limit','ADM for ticket issued after time limit or cancelled PNR not voided','Ticketing Total Limit','Tax Total Levy'],a:1,e:'TTL ADM = ticketing deadline violation'},
          {id:217,q:'How should you prevent name mismatch ADM?',o:['Ask customer spelling','Verify passport copy character by character before ticketing','Use common spelling','Trust customer verbally'],a:1,e:'Physical passport verification is the only reliable method'},
          {id:218,q:'What is successful ADM appeal rate?',o:['80%','20-30%','50%','90%'],a:1,e:'Most appeals fail; prevention is far better than appeals'},
          {id:219,q:'When should you appeal an ADM?',o:['Always','Only when you have genuine evidence of airline error or compliance','Never','For large amounts only'],a:1,e:'Appeal only with strong evidence; frivolous appeals damage relationships'},
          {id:220,q:'What evidence is needed for ADM appeal?',o:['Just explanation','Original fare quote, PNR history, passport copy, customer confirmation','Manager\'s word','System log only'],a:1,e:'Comprehensive documentary evidence required'},
          {id:221,q:'What is ADM Register used for?',o:['Decoration','Tracking all ADMs, causes, appeals, and training actions','Customer complaints','Revenue reporting'],a:1,e:'ADM register enables pattern analysis and prevention'},
          {id:222,q:'What triggers mandatory retraining for ADMs?',o:['1 ADM','More than 2 ADMs per month from same staff','Annual schedule','Manager request'],a:1,e:'Repeated ADMs indicate skill gap requiring intervention'},
          {id:223,q:'What is routing ADM?',o:['GPS error','ADM for violating fare rules on allowed routing/stopovers','Flight delay','Customer rerouting'],a:1,e:'Routing ADMs result from booking itineraries not allowed by fare rules'},
          {id:224,q:'How to prevent commission ADM?',o:['Take maximum commission','Only claim commission authorized for specific fare type','Estimate commission','Skip commission'],a:1,e:'Verify commission eligibility for each fare before claiming'},
          {id:225,q:'What should happen immediately after ADM received?',o:['Ignore it','Review within 24 hours, gather evidence, decide appeal vs accept','Wait for month end','Blame airline'],a:1,e:'Quick response preserves appeal options'},
        ]
      },
      {
        id: '6.3',
        title: 'Fraud Prevention & Data Privacy',
        duration: 40,
        questions: [
          {id:226,q:'What is payment fraud?',o:['Underpayment','Fake payment proofs, chargebacks, stolen cards','Late payment','Multiple payments'],a:1,e:'Payment fraud includes fake proofs, chargeback schemes, stolen cards'},
          {id:227,q:'What is first action when fraud suspected?',o:['Confront customer','STOP processing, document evidence, escalate to manager','Complete the booking','Call police immediately'],a:1,e:'Stop, document, escalate - never confront or continue'},
          {id:228,q:'What is internal fraud?',o:['Customer fraud','Staff bypassing controls, unauthorized refunds, commission manipulation','Supplier fraud','Bank fraud'],a:1,e:'Internal fraud involves staff misusing access/authority'},
          {id:229,q:'How long should passport copies be retained?',o:['Forever','Travel completion + 6 months','1 year after booking','7 years'],a:1,e:'Delete passport copies within 6 months of travel completion'},
          {id:230,q:'Can you save passport to personal computer desktop?',o:['Yes, for convenience','Never - only approved systems','Sometimes','With permission'],a:1,e:'Personal devices are not secure; use approved systems only'},
          {id:231,q:'What is acceptable for emailing credit card number?',o:['Encrypted email','Never email full card numbers - use payment links only','Normal email','WhatsApp'],a:1,e:'Card numbers should never be communicated via email'},
          {id:232,q:'What is data breach notification timeline?',o:['When convenient','Report to management within 1 hour; GDPR requires 72 hours','Next week','Monthly report'],a:1,e:'Rapid notification enables damage control'},
          {id:233,q:'What is \'dual verification\' for payments?',o:['Two payments','Two people must verify high-value payments','Double checking','Customer and agent'],a:1,e:'Dual verification adds fraud protection layer'},
          {id:234,q:'What customer behavior suggests fraud?',o:['Polite requests','Extreme urgency, refusal to verify, story changes, reluctance to ID','Multiple questions','Price negotiation'],a:1,e:'Behavioral red flags indicate potential fraud'},
          {id:235,q:'What happens to confirmed fraud customers?',o:['Warning only','Block immediately, report, update fraud database','Continue service','Discount offer'],a:1,e:'Confirmed fraud = immediate block and documentation'},
        ]
      },
      {
        id: '6.5',
        title: 'Customer Disputes & Audit Readiness',
        duration: 30,
        questions: [
          {id:236,q:'What is complaint severity \'Critical\'?',o:['Minor inconvenience','Missed flight, stranded traveler, denied boarding due to TMC error','Slow response','Price complaint'],a:1,e:'Critical = immediate impact on traveler\'s journey'},
          {id:237,q:'What is response time for Critical complaint?',o:['24 hours','Immediate','4 hours','Same day'],a:1,e:'Critical requires immediate action - traveler in distress'},
          {id:238,q:'What must NEVER appear in customer complaint response?',o:['Apology','Blame, excuses, internal jargon, negative language','Solution','Timeline'],a:1,e:'Focus on solution, not blame or excuses'},
          {id:239,q:'What triggers mandatory escalation?',o:['Any complaint','Social media complaint, legal threat, stranded traveler, CEO escalation','Price issue','Refund request'],a:1,e:'Specific triggers require immediate senior involvement'},
          {id:240,q:'What is \'goodwill\' in dispute resolution?',o:['Customer happiness','Compensation given to restore customer satisfaction','Smile policy','Free upgrade'],a:1,e:'Goodwill = gesture to recover relationship (within authority limits)'},
          {id:241,q:'What auditors look for primarily?',o:['Nice offices','Evidence of process compliance, traceability, controls working','High revenue','Many employees'],a:1,e:'Auditors want proof that documented processes are actually followed'},
          {id:242,q:'What is ISO 9001?',o:['Insurance standard','Quality management system standard','Security certification','Tax regulation'],a:1,e:'ISO 9001 = international quality management certification'},
          {id:243,q:'How often is QC sampling done?',o:['Monthly','Weekly','Annually','When problems arise'],a:1,e:'Weekly sampling catches issues before they become patterns'},
          {id:244,q:'What is RCA?',o:['Revenue Calculation Analysis','Root Cause Analysis - understanding why error happened','Report Card Assessment','Refund Credit Adjustment'],a:1,e:'RCA = systematic analysis to prevent recurrence'},
          {id:245,q:'What are RCA categories?',o:['Good and bad','People, Process, System, Supplier','High and low','Fast and slow'],a:1,e:'Categorizing root cause enables appropriate corrective action'},
        ]
      }
    ]
  }
];

// Cross-Pillar Scenarios (7-15)
export const SCENARIOS = [
  {id:7,pillar:null,title:'Multi-Product Retail Sale',text:'A family of 4 (2 adults, 2 children ages 8 and 10) is planning a 7-day trip to Dubai. Budget is approximately $5,000. They want flights, hotel, visa, and some tours.',question:'Walk through your discovery process and what products you would recommend.',answer:'Discovery: 1) Confirm dates and flexibility. 2) Understand purpose (leisure). 3) Hotel preference (star rating, location). 4) Children\'s interests. 5) Any special requirements. Recommendations: 1) Flights: Emirates or flydubai with good luggage allowance. 2) Hotel: 4-star family-friendly with pool, near attractions. 3) Visa: UAE tourist visa. 4) Insurance: Family travel insurance covering all 4. 5) Tours: Desert safari, waterpark, mall tour - kid-friendly. 6) Transfers: Airport return. Calculate blended margin ensuring profitability. Target attach rate: 100%.'},
  {id:8,pillar:null,title:'Corporate Policy Exception',text:'A corporate client\'s CEO wants to book first class for a 3-hour domestic flight. Company policy only allows business class for flights over 5 hours. The travel booker says \'the CEO always flies first class.\'',question:'How do you handle this situation?',answer:'1) Never bypass policy without documentation - even for CEO. 2) Politely explain that policy requires documented exception. 3) Request formal exception approval (email from CFO or policy exception form). 4) Log the exception request in CRM. 5) Once documented approval received, proceed with booking. 6) Tag booking as \'exception approved\' with reference. Key point: Everyone follows policy; exceptions require documentation regardless of seniority.'},
  {id:9,pillar:null,title:'Consolidation Wallet Fraud Attempt',text:'A new agent activated last week suddenly requests tickets totaling $15,000 in one day. Their wallet was topped up yesterday with $18,000. The booking pattern shows 10 different passengers to various destinations, all departing within 48 hours.',question:'What red flags do you see and what actions should you take?',answer:'Red flags: 1) New agent with high volume. 2) Large sudden wallet top-up. 3) Multiple unrelated passengers. 4) Urgent departures. 5) Diverse destinations. Actions: 1) STOP processing immediately. 2) Verify wallet top-up source. 3) Escalate to Finance Manager. 4) Request agent KYC verification. 5) Freeze wallet pending investigation. 6) Notify Sales Manager who onboarded agent. 7) Do not issue tickets until investigation complete.'},
  {id:10,pillar:null,title:'ADM Prevention - Name Discrepancy',text:'You\'re about to issue a ticket for passenger \'MOHAMED AHMED HASSAN\'. The passport copy shows \'MOHAMMED AHMED HASSAN\'. The customer insists \'it\'s the same name, just different spelling.\'',question:'What should you do?',answer:'1) NEVER accept \'same name, different spelling\' - it will trigger ADM. 2) Ticket MUST match passport exactly: \'MOHAMMED AHMED HASSAN\'. 3) Explain to customer that airlines verify against passport; any mismatch = denied boarding or ADM. 4) Issue ticket with EXACT passport spelling. 5) Document the discussion. Key: Spelling variations (MOHAMED/MOHAMMED/MOHAMAD) are different names to airline systems.'},
  {id:11,pillar:null,title:'Payment Fraud Detection',text:'A first-time retail customer wants to book a $3,500 family package to Maldives. They send a bank transfer screenshot showing payment made 10 minutes ago. They\'re calling every 5 minutes asking if ticket is issued yet, saying \'the fare will increase.\'',question:'Identify red flags and outline your response.',answer:'Red flags: 1) First-time customer. 2) High-value booking. 3) Screenshot only. 4) Extreme urgency/pressure. 5) \'Fare will increase\' pressure tactic. Response: 1) Thank customer for payment. 2) Explain verification process. 3) Check bank portal. 4) Do NOT rush despite pressure. 5) Request bank reference number. 6) If customer refuses, escalate to Finance Manager. 7) Never issue without Finance \'Payment Verified\' confirmation.'},
  {id:12,pillar:null,title:'SLA Breach Prevention',text:'You have 3 tickets in your queue: Ticket A is at 85% SLA, Ticket B is at 50% SLA, Ticket C is at 95% SLA. All are retail air ticketing requests. You can only handle one at a time, each taking approximately 20 minutes.',question:'How do you prioritize and what actions do you take?',answer:'1) Ticket C first - 95% SLA means breach imminent. 2) While working Ticket C, send message to Team Lead about Ticket A (85%). 3) If Ticket C has blockers, escalate immediately rather than continue trying. 4) After Ticket C resolved, take Ticket A. 5) Ticket B at 50% can wait. Key insight: Escalate BEFORE breach, not after. Communicate proactively.'},
  {id:13,pillar:null,title:'Data Privacy Breach',text:'You accidentally sent an email containing 5 customers\' passport copies to the wrong recipient - another customer with a similar email address. You realize this 2 minutes after sending.',question:'What immediate actions must you take?',answer:'1) Immediately report to manager (within minutes). 2) Document what was sent and to whom. 3) Contact wrong recipient requesting deletion. 4) Attempt email recall if available. 5) Manager notifies compliance/DPO. 6) Affected customers must be notified. 7) Incident logged in data breach register. 8) GDPR requires regulatory notification within 72 hours if significant. 9) Review process to prevent recurrence.'},
  {id:14,pillar:null,title:'Complex Refund Calculation',text:'A customer booked Lagos-London return for $1,200 (base fare $900, taxes $300). They want to cancel. Fare rules show: $200 cancellation fee, non-refundable YQ ($150), refundable taxes ($150).',question:'Calculate the refund amount and explain to the customer.',answer:'Calculation: Original $1,200. Cancellation fee: $200. Non-refundable YQ: $150. Refundable taxes: $150. Refund = refundable taxes only = $150. Explanation: \'Based on fare rules, the cancellation fee is $200 and the base fare is non-refundable. Of the taxes, $150 are government taxes that are refundable, and $150 are airline surcharges that are non-refundable. Your refund will be $150.\''},
  {id:15,pillar:null,title:'Audit Preparation',text:'An auditor arrives tomorrow for a spot check. They want to review 10 random retail bookings from last month covering the full process from lead to post-travel.',question:'What documentation should you be able to produce for each booking?',answer:'For each booking: 1) CRM lead record with source and timeline. 2) Discovery notes and customer requirements. 3) Quote versions sent. 4) Customer confirmation of final quote. 5) Payment proof. 6) Finance verification record. 7) Handover documentation. 8) Zoho Desk ticket with full history. 9) QC checklist (completed). 10) PNR and ticket copies. 11) Customer delivery confirmation. 12) Any amendments with approvals. 13) Post-travel feedback if collected.'},
];

// Certification Rules
export const CERTIFICATION_RULES = {
  passMark: 80,
  managerPassMark: 85,
  maxAttempts: 3,
  retakeGapHours: 48,
  validityMonths: 12,
};

// Helper: Get all questions for a pillar
export function getPillarQuestions(pillarId) {
  const pillar = PILLARS.find(p => p.id === pillarId);
  if (!pillar) return [];
  const questions = [];
  for (const mod of pillar.modules) {
    questions.push(...mod.questions);
  }
  return questions;
}

// Helper: Get questions for a specific module
export function getModuleQuestions(pillarId, moduleId) {
  const pillar = PILLARS.find(p => p.id === pillarId);
  if (!pillar) return [];
  const mod = pillar.modules.find(m => m.id === moduleId);
  return mod ? mod.questions : [];
}

// Helper: Get scenarios for a module
export function getModuleScenarios(pillarId, moduleId) {
  const pillar = PILLARS.find(p => p.id === pillarId);
  if (!pillar) return [];
  const mod = pillar.modules.find(m => m.id === moduleId);
  return mod && mod.scenarios ? mod.scenarios : [];
}

// Helper: Format question for frontend (strip answers)
export function formatQuestionsForClient(questions) {
  return questions.map((q, idx) => ({
    index: idx,
    id: q.id,
    type: 'multiple_choice',
    question: q.q,
    options: q.o.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`),
  }));
}

// Helper: Grade answers against question bank
export function gradeAnswers(questions, userAnswers) {
  let score = 0;
  const results = questions.map((q, idx) => {
    const userAnswer = userAnswers.find(a => a.index === idx)?.answer || '';
    const correctLetter = String.fromCharCode(65 + q.a);
    const correctFull = `${correctLetter}. ${q.o[q.a]}`;

    // Match by letter prefix (e.g., "A" or "A. Travel Management Company")
    const userLetter = userAnswer.trim().charAt(0).toUpperCase();
    const isCorrect = userLetter === correctLetter;

    if (isCorrect) score++;

    return {
      index: idx,
      question_id: q.id,
      question: q.q,
      type: 'multiple_choice',
      user_answer: userAnswer,
      correct_answer: correctFull,
      explanation: q.e,
      is_correct: isCorrect,
    };
  });

  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return { score, total, percentage, passed: percentage >= 80, results };
}

// Helper: Shuffle array (Fisher-Yates)
export function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
