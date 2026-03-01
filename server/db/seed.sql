-- ==========================================
-- DOMESTIC POLICY (Scale)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'The Role of Government in Healthcare',
    'Healthcare is one of the most debated domestic policy issues in America. The United States spends more per capita on healthcare than any other developed nation, yet millions remain uninsured or underinsured. Proponents of government-provided healthcare argue that access to medical care is a fundamental right, pointing to Medicare, Medicaid, and the VA system as proof that government can deliver care effectively. They highlight that countries with universal systems — such as Canada, the UK, and most of Europe — achieve comparable or better health outcomes at lower cost.

On the other side, advocates for individual responsibility argue that government involvement drives up costs, reduces quality, and limits personal choice. They point to long wait times in single-payer systems, the innovation that comes from market competition, and the principle that individuals should be free to choose their own coverage. Religious traditions also weigh in: many faith communities emphasize caring for the sick as a moral duty, while others stress personal stewardship and warn against dependency on the state.

To what extent should the government be responsible for providing healthcare to its citizens? Consider the balance between individual responsibility, community care, and governmental authority.',
    'domestic policy', 'scale',
    'Fully Individual Responsibility',
    'Fully Government Provided',
    1, 1
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Immigration and Border Enforcement',
    'Immigration policy sits at the intersection of national security, economic necessity, humanitarian concern, and cultural identity. The United States has historically been a nation of immigrants — from the waves of European migration in the 19th century to the Latin American, Asian, and African immigration of recent decades. Yet the question of how to manage borders and who gets to become American remains deeply contentious.

Those favoring stricter enforcement argue that a nation without secure borders cannot remain sovereign. They point to concerns about drug trafficking, human smuggling, strain on public services, and wage depression for low-skilled American workers. Recent debates have centered on deportation operations, the role of ICE, sanctuary city policies, and whether immigration agents should operate near sensitive locations like schools, hospitals, and polling places.

Those favoring more open policies argue that immigrants are essential to the economy, filling labor shortages in agriculture, construction, healthcare, and technology. They emphasize the moral imperative to welcome refugees fleeing violence and persecution, and they note that most undocumented immigrants are law-abiding, tax-paying members of their communities. Many religious traditions teach hospitality to the stranger and care for the displaced.

How should the United States balance border security with compassion for immigrants and refugees?',
    'domestic policy', 'scale',
    'Open Borders / Path to Citizenship',
    'Maximum Enforcement / Deportation',
    1, 2
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Gun Rights and Firearm Regulation',
    'The Second Amendment to the U.S. Constitution states: "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed." Few constitutional provisions generate as much debate as this one. America has more civilian-owned firearms than any other country — an estimated 400 million guns for 330 million people — and also leads the developed world in gun deaths.

Supporters of gun rights argue that firearm ownership is a fundamental constitutional right and a crucial safeguard against tyranny. They point to the role of armed citizens in American history, the practical need for self-defense (especially in rural areas where police response times are long), and the cultural significance of hunting and sport shooting. Organizations like the NRA argue that gun laws primarily burden law-abiding citizens while doing little to stop criminals.

Advocates for stricter regulation point to the staggering toll of gun violence: over 45,000 Americans die from firearms annually, including mass shootings at schools, churches, and public gatherings. They propose measures like universal background checks, assault weapon bans, red flag laws (which allow courts to temporarily remove guns from people deemed dangerous), waiting periods, and safe storage requirements. They argue that common-sense regulation is compatible with the Second Amendment, just as free speech has reasonable limits.

Where should the line be drawn between Second Amendment rights and public safety?',
    'domestic policy', 'scale',
    'Strict Gun Control',
    'Unrestricted Gun Rights',
    1, 3
);

-- ==========================================
-- ECONOMICS (Scale)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Tariffs and Trade Policy',
    'Trade policy determines how the United States interacts economically with the rest of the world. For decades, both parties broadly supported free trade — the idea that reducing barriers to international commerce benefits all countries through comparative advantage, lower consumer prices, and economic growth. NAFTA, the WTO, and various bilateral trade agreements reflected this consensus.

However, the free trade consensus has fractured. Critics argue that globalization hollowed out American manufacturing, shipping millions of jobs overseas while enriching multinational corporations. Rust Belt cities like Detroit, Youngstown, and Gary bear visible scars. The Supreme Court recently struck down the use of emergency powers to impose broad tariffs, creating a constitutional crisis over trade authority.

Proponents of tariffs argue they protect American workers, rebuild domestic industry, and provide leverage in negotiations with countries like China that engage in unfair trade practices such as intellectual property theft, currency manipulation, and state subsidies. They point to the historical use of tariffs by leaders like Alexander Hamilton and Abraham Lincoln to build American industry.

Opponents counter that tariffs are effectively a tax on American consumers, raising prices on everything from electronics to groceries. They note that trade wars invite retaliation, harming American farmers and exporters, and that protectionism historically leads to economic contraction.

Should the U.S. use tariffs aggressively to protect domestic industry, or does free trade better serve American workers and consumers?',
    'economics', 'scale',
    'Free Trade / No Tariffs',
    'Aggressive Protectionism',
    1, 4
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Government Spending and the National Debt',
    'The United States national debt has surpassed $36 trillion, a figure that grows by roughly $1 trillion every few months. Interest payments on the debt now exceed the entire defense budget, consuming over $800 billion annually. This trajectory has led economists across the political spectrum to warn that the current fiscal path is unsustainable.

Those who favor cutting government spending argue that bureaucratic waste is rampant, that many federal programs have outlived their usefulness, and that a leaner government would unleash private sector growth. Some propose eliminating entire agencies, implementing zero-based budgeting (where every program must justify its existence each year), and converting entitlements to block grants. They argue that fiscal discipline today prevents a catastrophic debt crisis tomorrow.

Those who favor maintaining or increasing government spending argue that programs like Social Security, Medicare, Medicaid, food assistance, and education funding form the social safety net that prevents millions of Americans from falling into poverty. They point out that cutting spending during economic uncertainty can trigger recessions, and that investing in infrastructure, research, and education generates long-term economic returns that more than pay for themselves. They note that the debt has also been driven by tax cuts, not just spending.

The debate extends to military spending (the largest discretionary budget item), entitlement reform (the largest mandatory spending), and whether economic growth can outpace debt accumulation.

Where do you fall on the spectrum between expanding government services and drastically cutting government size?',
    'economics', 'scale',
    'Increase Spending on Services',
    'Drastically Cut Government Size',
    1, 5
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Flat Tax vs. Progressive Taxation',
    'The structure of the tax system reflects a society''s deepest values about fairness, incentives, and the role of government. Currently, the U.S. uses a progressive income tax system where rates increase with income — the top marginal rate is 37% for income above roughly $578,000, while the lowest bracket pays 10%. When combined with deductions, credits, and loopholes, the effective tax rate varies enormously.

Advocates for a flat tax argue that simplicity and fairness demand that everyone pay the same percentage. If the rate is 15%, a person earning $50,000 pays $7,500 and a person earning $5 million pays $750,000 — the wealthy still pay far more in absolute terms. They argue that progressive taxation punishes success, discourages investment and risk-taking, and creates a complex system that favors those who can afford expensive accountants. Several countries, including Estonia and Russia, have implemented flat taxes with positive economic results.

Advocates for progressive taxation argue that the ability to pay should determine the tax burden. A dollar means far more to a family earning $40,000 than to a billionaire — taxing them at the same rate creates equal rates but unequal sacrifice. They point to the era of greatest American prosperity (the 1950s-60s) when the top marginal rate exceeded 90%. They also note that wealth inequality has reached levels not seen since the Gilded Age, with the top 1% owning more wealth than the bottom 90% combined.

Various religious and philosophical traditions offer competing perspectives — from the biblical principle of proportional giving (tithing) to utilitarian arguments about maximizing overall welfare to libertarian objections to any redistribution of wealth.

Should everyone pay the same tax rate, or should wealthier individuals pay a higher percentage?',
    'economics', 'scale',
    'Highly Progressive / Tax the Wealthy',
    'Flat Tax for All',
    1, 6
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Climate Policy and Carbon Pricing',
    'Climate change represents one of the defining challenges of the 21st century. Scientific consensus holds that human activities — primarily burning fossil fuels — have raised global temperatures by approximately 1.1°C since pre-industrial times, with projections of 1.5-4.5°C further warming by 2100 depending on emissions trajectories. The consequences include rising sea levels, more extreme weather events, disrupted agriculture, and mass species extinction.

Those advocating aggressive climate action argue that the costs of inaction far exceed the costs of transition. They support policies like a carbon tax (making polluters pay for emissions), cap-and-trade systems (setting emissions limits and allowing companies to trade permits), massive investment in renewable energy, and regulations phasing out fossil fuel infrastructure. They point to the Paris Climate Accords as a framework for global cooperation and note that clean energy is now cheaper than fossil fuels in many markets.

Those opposing carbon pricing argue that such policies amount to a regressive tax that raises energy costs for ordinary Americans, particularly those in rural areas and cold climates. They contend that unilateral action by the U.S. — which produces about 13% of global emissions — would be economically devastating while China and India continue to increase their emissions. They favor an "all of the above" energy strategy emphasizing energy independence through domestic oil, gas, and nuclear production.

The U.S. has withdrawn from the Paris Climate Accords, and energy policy remains deeply divided between states investing heavily in renewables and those doubling down on fossil fuel production.

Should the U.S. adopt a carbon tax to address climate change, or would such policies hurt American industry and consumers?',
    'economics', 'scale',
    'Aggressive Climate Action / Carbon Tax',
    'Prioritize Energy Independence / No Carbon Tax',
    1, 7
);

-- ==========================================
-- GOVERNANCE (Scale)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Presidential Power and Executive Authority',
    'The framers of the Constitution created a system of separated powers precisely because they feared concentrated authority. Article I grants legislative power to Congress, Article II grants executive power to the President, and Article III grants judicial power to the courts. Yet the balance between these branches has shifted dramatically over the past century, with the presidency accumulating far more power than the founders envisioned.

Modern presidents routinely use executive orders to bypass Congress, invoke emergency powers for military deployments and trade policy, and claim executive privilege to shield information from oversight. Supporters of strong executive authority argue that in a complex, fast-moving world, decisive presidential leadership is essential. Congress is slow, polarized, and often gridlocked — someone needs to act. They point to historical precedents from Lincoln''s suspension of habeas corpus to FDR''s New Deal executive actions as examples of necessary presidential boldness.

Critics of expanded executive power warn that the erosion of checks and balances threatens democratic governance itself. They argue that executive orders are meant for administrative management, not major policy changes; that emergency powers have been stretched far beyond their intended scope; and that Congress has abdicated its constitutional responsibilities by allowing presidents to act unilaterally. Recent debates have centered on executive orders bypassing Congress on immigration, tariffs imposed via emergency powers, military deployments without congressional authorization, and the firing of inspectors general and independent agency heads.

The question cuts across party lines — both liberals and conservatives have supported executive power when their side holds the White House and opposed it when the other side does.

How much unilateral power should the President have?',
    'governance', 'scale',
    'Strictly Limited Executive Power',
    'Strong Executive Authority',
    1, 8
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Election Integrity and Voting Access',
    'The right to vote is the foundation of democratic self-governance, yet Americans disagree profoundly about whether the greater threat to democracy comes from fraudulent voting or from barriers that prevent eligible citizens from casting ballots.

Those prioritizing election security point to concerns about voter fraud, non-citizen voting, outdated voter rolls, and vulnerabilities in mail-in ballot systems. They support measures like strict voter ID requirements, proof of citizenship for registration, limiting mail-in voting to those with valid excuses, purging voter rolls of inactive registrations, and post-election audits. Several states are implementing new voter ID laws ahead of the 2026 midterms. Supporters argue these measures are common-sense safeguards that protect the legitimacy of elections and maintain public confidence in the system.

Those prioritizing voter access argue that voter fraud is exceedingly rare — study after study has found fraud rates below 0.001% — while millions of eligible Americans face real barriers to voting. Strict ID laws disproportionately affect elderly, minority, low-income, and rural voters who are less likely to have government-issued photo identification. They support expanding early voting, automatic voter registration, same-day registration, and no-excuse mail-in balloting. They point out that the United States has among the lowest voter turnout rates in the developed world, and that making voting harder undermines the very democracy these security measures claim to protect.

The debate also extends to gerrymandering (drawing district lines to favor one party), the Electoral College vs. popular vote, campaign finance, and whether Election Day should be a national holiday.

Is election security or voter access the greater priority?',
    'governance', 'scale',
    'Maximize Voter Access',
    'Strict Election Security Measures',
    1, 9
);

-- ==========================================
-- FOREIGN POLICY (Scale)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'The Ukraine-Russia War and U.S. Involvement',
    'Russia''s full-scale invasion of Ukraine in February 2022 triggered the largest land war in Europe since World War II. As the conflict enters its fifth year, the toll has been staggering: hundreds of thousands of casualties on both sides, millions of Ukrainian refugees, devastated cities, disrupted global food and energy markets, and the ever-present risk of nuclear escalation.

The United States and its NATO allies have provided over $175 billion in military, economic, and humanitarian aid to Ukraine. Supporters of continued aid argue that Ukraine is fighting not just for its own sovereignty but for the principle that powerful nations cannot simply conquer their neighbors. They warn that if Russia succeeds, it will embolden China regarding Taiwan, destabilize the entire European security order, and demonstrate that aggression pays. They see supporting Ukraine as a relatively low-cost way to degrade a geopolitical rival without risking American lives.

Those favoring reduced involvement argue that the war has become a costly stalemate with no clear path to Ukrainian victory. They contend that the money spent on Ukraine would be better invested at home, that the U.S. should focus on the greater strategic challenge from China, and that continued escalation risks direct confrontation between nuclear powers. Some advocate for a negotiated settlement, even if it means Ukraine ceding territory, arguing that an imperfect peace is better than endless war.

Others take an intermediate position, supporting diplomatic engagement to find a resolution while maintaining enough military support to ensure Ukraine negotiates from a position of strength rather than desperation.

What level of U.S. involvement in the Ukraine-Russia war do you support?',
    'foreign policy', 'scale',
    'Withdraw U.S. Support',
    'Full Military and Financial Support',
    1, 10
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Iran: Diplomacy or Military Action?',
    'The relationship between the United States and Iran has been defined by hostility since the 1979 Islamic Revolution, which overthrew the U.S.-backed Shah and established a theocratic government. The central concern for the U.S. and its allies — particularly Israel and Saudi Arabia — is Iran''s nuclear program, which Western intelligence agencies believe has brought Iran to the threshold of producing a nuclear weapon.

The diplomatic approach was embodied by the 2015 JCPOA (Iran Nuclear Deal), which lifted international sanctions in exchange for strict limits on Iran''s nuclear enrichment and intrusive international inspections. Supporters of diplomacy argue that the deal was working — Iran had reduced its enriched uranium stockpile by 98% and was complying with inspections. They contend that engagement, however imperfect, is better than the alternative, and that military strikes would only delay Iran''s nuclear program while guaranteeing permanent hostility and regional destabilization.

Those favoring a harder line argue that the JCPOA merely delayed Iran''s nuclear ambitions while enriching a regime that sponsors terrorism through Hezbollah, Hamas, and the Houthis, threatens Israel''s existence, and brutally represses its own people. Following U.S. strikes on Iranian nuclear sites and ongoing regime protests, some in the administration have floated regime change as a goal. Supporters argue that maximum pressure through sanctions, military deterrence, and support for Iranian dissidents is the only language the regime understands.

The stakes are enormous: a nuclear-armed Iran could trigger a regional arms race, while military confrontation could engulf the entire Middle East.

Should the U.S. pursue diplomacy and nuclear agreements, or take a harder military and sanctions-based approach toward Iran?',
    'foreign policy', 'scale',
    'Diplomacy / Nuclear Agreements',
    'Military Pressure / Regime Change',
    1, 11
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Foreign Aid and International Organizations',
    'The United States has long been the world''s largest foreign aid donor, providing roughly $50-60 billion annually in development assistance, humanitarian relief, health programs (including PEPFAR, which has saved an estimated 25 million lives from HIV/AIDS), and security aid. The U.S. has also been the largest funder of international organizations like the United Nations, the World Health Organization, and the World Bank. Recently, the U.S. has withdrawn from the WHO, cut most foreign development aid, and reduced UN funding.

Critics of foreign aid argue that much of this spending is wasteful, poorly targeted, or props up corrupt governments. They contend that America should focus its resources on domestic needs — crumbling infrastructure, failing schools, homelessness — rather than sending billions abroad. They question the effectiveness of international organizations, pointing to the WHO''s handling of the COVID-19 pandemic and the UN''s inability to prevent conflicts, and argue that these institutions are bloated bureaucracies that often work against American interests.

Supporters of foreign aid and international engagement counter that these programs represent a tiny fraction of the federal budget (less than 1%) but yield enormous strategic returns. Development aid builds goodwill, opens markets for American goods, prevents the conditions (poverty, disease, instability) that breed terrorism and mass migration, and maintains America''s position as the global leader of a rules-based international order. They warn that when the U.S. retreats, rivals like China and Russia fill the vacuum — China''s Belt and Road Initiative has already expanded its influence across Africa, Asia, and Latin America.

Is cutting foreign aid and withdrawing from international organizations a smart reallocation of taxpayer money, or does it undermine global stability and America''s standing?',
    'foreign policy', 'scale',
    'Restore and Expand Foreign Aid',
    'America First / Cut Foreign Spending',
    1, 12
);

-- ==========================================
-- BINARY ISSUES (Yes/No)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Should the U.S. Have Captured Maduro?',
    'In January 2026, U.S. military forces captured Venezuelan leader Nicolás Maduro in a dramatic operation that made headlines around the world. Maduro had ruled Venezuela since 2013, overseeing an economic collapse that turned one of South America''s wealthiest nations into a humanitarian catastrophe — hyperinflation, widespread hunger, the collapse of the healthcare system, and the exodus of over 7 million Venezuelans. His regime had been accused of drug trafficking, political repression, torture of dissidents, and rigging elections.

Those who support the operation argue that Maduro was a brutal dictator who had lost all democratic legitimacy, that he was indicted by U.S. federal courts for narco-terrorism, and that his removal was both morally justified and strategically necessary to stabilize the region and stem the flow of Venezuelan refugees. They compare the operation to the capture of Manuel Noriega in Panama and argue that sometimes direct action is the only way to stop a tyrant.

Those who oppose the operation argue that it violated Venezuelan sovereignty and set a dangerous precedent — if the U.S. can forcibly remove leaders it dislikes, no nation''s sovereignty is safe. They worry about unintended consequences, including destabilization, power vacuums, and the backlash from Latin American nations that view U.S. intervention as imperialism. They argue that diplomatic pressure, sanctions, and support for Venezuelan civil society would have been a more legitimate path to change. International law scholars have raised serious questions about the legality of the operation under both U.S. and international law.

Was capturing Maduro the right call?',
    'foreign policy', 'binary',
    'No — Violation of Sovereignty',
    'Yes — Justified Removal',
    1, 13
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Should the U.S. Negotiate a New Nuclear Treaty?',
    'The New START treaty — the last remaining nuclear arms control agreement between the United States and Russia — expired without renewal, leaving no legal limits on the world''s two largest nuclear arsenals for the first time since 1972. Without constraints, both nations could theoretically deploy over 6,000 nuclear warheads each, enough to destroy civilization multiple times over. China is also rapidly expanding its nuclear arsenal, projected to reach 1,500 warheads by 2035.

Those who support a new treaty argue that arms control agreements have been one of humanity''s greatest achievements, preventing nuclear catastrophe during the Cold War and reducing global stockpiles by over 80% from their peak. They contend that without verifiable limits and inspection regimes, both sides will spend trillions on unnecessary weapons while increasing the risk of miscalculation or accidental launch. They advocate for a trilateral agreement that includes China, arguing that 21st-century arms control must reflect 21st-century realities.

Those who oppose a new treaty argue that Russia has repeatedly violated arms control agreements (including the INF Treaty) and cannot be trusted. They contend that the U.S. must maintain nuclear superiority to deter both Russia and China, and that treaties constrain American flexibility while adversaries cheat. Some argue that nuclear modernization — updating delivery systems, warheads, and command infrastructure — is a more reliable path to security than paper agreements. They note that China has refused to participate in arms control talks, making any bilateral U.S.-Russia treaty strategically incomplete.

The stakes could not be higher: nuclear weapons remain the one technology capable of ending human civilization in hours.

Should the U.S. pursue a new arms control agreement?',
    'foreign policy', 'binary',
    'No — Maintain Superiority',
    'Yes — Pursue a New Treaty',
    1, 14
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Should AI Development Be Paused Until Regulated?',
    'Artificial intelligence is advancing at a pace that has surprised even its creators. Large language models can now write code, generate legal documents, produce photorealistic images, and engage in sophisticated reasoning. AI systems are being deployed in healthcare diagnostics, financial trading, military applications, and criminal justice. Some researchers warn that we may be approaching artificial general intelligence (AGI) — systems that match or exceed human cognitive abilities across all domains — within the next decade.

Those who support a pause argue that we are racing toward a technology we do not fully understand, with potentially catastrophic consequences. They point to documented harms: AI-generated deepfakes undermining elections, algorithmic bias in hiring and lending, autonomous weapons that could decide to kill without human oversight, and the potential for mass unemployment as AI automates white-collar work. Leading AI researchers, including some who built these systems, have signed open letters warning that AI poses an existential risk to humanity. They argue that a temporary pause would allow governments to establish safety standards, testing requirements, and ethical guidelines before it is too late.

Those who oppose a pause argue that unilateral action by the United States would simply hand technological leadership to China, Russia, and other nations that would not pause. They contend that AI has enormous potential to solve humanity''s greatest challenges — curing diseases, addressing climate change, expanding access to education — and that slowing progress would cost lives. They favor targeted regulation of specific harmful applications rather than blanket restrictions on research and development. Many in the tech industry argue that innovation moves faster than regulation, and that excessive government oversight would stifle the economic growth and job creation that AI promises.

Do you support pausing AI development until proper safety frameworks are in place?',
    'technology', 'binary',
    'No — Keep Innovating',
    'Yes — Pause and Regulate',
    1, 15
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Should the U.S. Rejoin the WHO?',
    'The United States withdrew from the World Health Organization, ending decades of American leadership in global health. The WHO, founded in 1948 as a United Nations agency, coordinates international health responses, sets medical standards, and runs programs addressing everything from polio eradication to pandemic preparedness. The U.S. had been the WHO''s largest single funder, contributing roughly $700 million annually — about 15-20% of the organization''s total budget.

Those who support rejoining argue that global health threats do not respect national borders. Pandemics, antibiotic resistance, and emerging infectious diseases require coordinated international responses, and the WHO — despite its flaws — is the only organization with the global reach and technical expertise to lead that coordination. They warn that America''s withdrawal has created a leadership vacuum that China is eagerly filling, potentially reshaping global health governance to serve Beijing''s interests. They also note that PEPFAR, vaccine distribution networks, and disease surveillance systems all rely on WHO infrastructure.

Those who oppose rejoining argue that the WHO has proven itself ineffective and politically compromised. They point to the organization''s deference to China during the early days of COVID-19, its delayed declaration of a pandemic, its failure to secure access for investigators to determine the origins of the virus, and its bloated bureaucracy. They contend that U.S. taxpayer money would be better spent on domestic health priorities or bilateral health partnerships where America has more control over how funds are used. Some propose creating a new, reformed international health body that learns from the WHO''s failures.

Should the U.S. rejoin the World Health Organization?',
    'foreign policy', 'binary',
    'No — Stay Out',
    'Yes — Rejoin the WHO',
    1, 16
);

-- ==========================================
-- CULTURE (Scale + Binary)
-- ==========================================

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'The Role of Faith in Public Education',
    'The relationship between religion and public education has been contested since the founding of the American public school system. The First Amendment''s Establishment Clause prohibits the government from establishing or favoring any religion, while the Free Exercise Clause protects individuals'' right to practice their faith. Courts have repeatedly tried to define the boundary between these principles in the school context.

Those who favor faith-integrated education argue that the current system has gone too far in stripping religious values from schools, creating a moral vacuum. They contend that America was founded on Judeo-Christian principles, that the separation of church and state was never meant to exclude God from public life, and that teaching religious history, values, and texts (alongside secular perspectives) would help address the crisis of meaning, mental health struggles, and moral relativism affecting young people. Several states have recently passed laws allowing or requiring Bible literacy courses, the display of the Ten Commandments, and moments of prayer in schools. Parents'' rights advocates argue that families, not the state, should determine the moral education of their children.

Those who favor fully secular education argue that public schools serve children of all faiths and none, and that introducing religious content inevitably privileges some traditions over others. They point out that America''s religious diversity — including Christians, Muslims, Jews, Hindus, Buddhists, Sikhs, atheists, and agnostics — makes neutrality the only fair position. They worry that "faith in schools" often means a particular version of Christianity, marginalizing minority religious students. They argue that critical thinking, evidence-based reasoning, and exposure to diverse worldviews better prepare students for citizenship in a pluralistic democracy.

Should religious values and teachings have a place in public school curricula?',
    'culture', 'scale',
    'Fully Secular Education',
    'Faith-Integrated Education',
    1, 17
);

INSERT INTO issues (title, description, category, vote_type, scale_label_low, scale_label_high, is_active, sort_order)
VALUES (
    'Should There Be a Mandatory National Service Program?',
    'The idea of mandatory national service — requiring all young Americans to complete one to two years of military or civilian service — has been proposed periodically by leaders on both sides of the political aisle. Countries like Israel, South Korea, Switzerland, and Singapore already require some form of national service, and several European nations are considering reinstating it in response to growing security threats.

Proponents argue that national service would build a shared sense of citizenship and purpose in an era of extreme polarization. By bringing together young people from different backgrounds — urban and rural, wealthy and poor, every race and religion — to work toward common goals, service could bridge the divides tearing America apart. They point to the legacy of the Greatest Generation, shaped by shared sacrifice in World War II, and argue that programs like AmeriCorps, the Peace Corps, and military service transform lives and build skills. Civilian service options could include disaster relief, infrastructure projects, elder care, environmental conservation, tutoring, and public health work. Some proposals include educational benefits (like the GI Bill) as an incentive.

Opponents argue that mandatory service is fundamentally incompatible with the American ideal of individual liberty. Forcing young people to serve the government — whether in the military or civilian roles — amounts to conscription, which has historically been deeply unpopular and was abolished after the Vietnam War for good reason. They worry about the enormous cost, the logistical challenge of processing millions of young people each year, the disruption to education and career paths, and the potential for government abuse. Libertarians argue that voluntary service is morally meaningful precisely because it is chosen, and that compulsion destroys its value.

Would mandatory national service build national unity and character, or would it infringe on personal freedom?',
    'culture', 'binary',
    'No — Protect Individual Freedom',
    'Yes — Build National Unity',
    1, 18
);
