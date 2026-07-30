import { useState } from 'react';
import { Link } from 'react-router-dom';

const ARTICLES = [
  {
    date: 'July 15, 2026',
    category: 'Women in Business',
    title: 'The Untapped Architecture of Economic Transformation',
    excerpt:
      'Every economy that limits the participation of women in business effectively restricts its own productive capacity. The future belongs to economies capable of harnessing the full range of human talent available to them.',
    readTime: '12 min read',
    featured: true,
    image:
      'https://res.cloudinary.com/djxprptlf/image/upload/article1.jpg',
    slug: 'untapped-architecture-economic-transformation',
    body: `When economists discuss the engines of national development, they often point to industrialization, technological innovation, foreign investment, infrastructure development, and macroeconomic stability. These factors are undoubtedly important. Yet beneath every thriving economy exists a less visible force that is frequently underestimated, underfunded, and underutilized: the economic power of women.

Across continents, women are building businesses, creating jobs, driving innovation, sustaining families, and strengthening communities. Their enterprises range from multinational corporations and technology startups to agricultural ventures, manufacturing firms, creative industries, and informal market operations. Despite their immense contributions, women remain one of the world's most underleveraged economic assets.

The conversation about women in business is often framed through the language of empowerment. While empowerment is important, it does not fully capture the significance of women's economic participation. The issue is not merely one of fairness or inclusion; it is fundamentally about economic efficiency, national competitiveness, and sustainable development. Every economy that limits the participation of women in business effectively restricts its own productive capacity. In an increasingly competitive global environment, nations can no longer afford to treat women's economic potential as a secondary consideration.

Historically, women have always participated in economic activities. Long before modern corporations emerged, women managed trade networks, organized agricultural production, coordinated local markets, and sustained household economies. Across Africa, women played critical roles in commerce, often serving as the connective tissue linking producers, traders, and consumers. In Nigeria, this tradition remains evident today. From the bustling markets of Onitsha and Aba to the commercial corridors of Kano, Lagos, Ibadan, and Port Harcourt, women continue to drive significant portions of economic activity.

One of the most fascinating contradictions within economic development is that many of the activities that sustain economies are performed by women, yet the structures that distribute economic opportunities frequently disadvantage them. Women-owned enterprises collectively contribute billions of naira to Nigeria's economy, generate employment opportunities, and support household welfare. However, many women entrepreneurs continue to operate under conditions that limit growth. Access to finance remains one of the most significant barriers.

The emergence of the digital economy is beginning to alter this landscape in profound ways. Technology has become one of the most significant democratizing forces in modern business. Unlike traditional economic systems, which often required substantial capital and physical infrastructure, digital platforms allow entrepreneurs to reach customers, build brands, and conduct transactions with relatively lower entry barriers.

Ultimately, the question is not whether women belong in business. Their contributions have already demonstrated that they do. The more important question is whether societies are prepared to remove the barriers that continue to limit their potential. The economies that flourish in the decades ahead will not be those that simply include women in existing structures. They will be those that fully recognize women as indispensable partners in building the future.`,
  },

  {
    date: 'July 10, 2026',
    category: 'Women in Leadership',
    title:
      'Women and Leadership: The Leadership Paradox of the Twenty-First Century',
    excerpt:
      "Women have always led. What has changed is not the presence of women in leadership but society's willingness to recognize their leadership as such.",
    readTime: '10 min read',
    featured: true,
    image:
      'https://res.cloudinary.com/djxprptlf/image/upload/article2.jpg',
    slug: 'women-leadership-paradox-twenty-first-century',
    body: `History remembers leaders through monuments, institutions, policies, and transformative ideas. Yet history has never been a neutral recorder of human achievement. Throughout civilizations, leadership has often been documented through the actions of those who occupied formal positions of authority, while the contributions of countless others who exercised influence outside official structures remained largely invisible.

This historical tendency has shaped contemporary understandings of leadership and, perhaps more importantly, has contributed to one of the most persistent misconceptions in modern society: the notion that women are relatively recent participants in leadership. The truth is far more complex. Women have always led. They have led families through economic hardship, sustained communities during periods of conflict, transmitted cultural values across generations, and built informal systems of resilience that frequently became the backbone of social survival.

The twenty-first century has witnessed remarkable progress in expanding opportunities for women within formal leadership structures. Across governments, international organizations, academia, technology, finance, and civil society, women are increasingly occupying positions once considered inaccessible. However, the celebration of progress should not obscure a more complicated reality. While women have gained greater access to leadership positions, many institutions continue to operate according to assumptions, norms, and power structures established during periods when leadership was almost exclusively associated with men.

This distinction between access and acceptance is central to understanding the modern leadership paradox. Securing a seat at the decision-making table does not necessarily guarantee influence over the decisions being made. Around the world, women frequently encounter expectations that require them to perform a delicate balancing act. They are expected to demonstrate confidence without appearing intimidating, ambition without appearing self-serving, authority without appearing aggressive, and empathy without appearing weak.

The Nigerian experience offers a compelling illustration of this phenomenon. Across the country, women routinely manage highly complex systems that demand strategic thinking, financial discipline, negotiation skills, and long-term planning. The trader coordinating supply chains across multiple states from a market in Kano or Onitsha demonstrates logistical expertise that would be admired in many corporate environments.

Ultimately, the conversation about women and leadership is not solely a conversation about women. It is a conversation about the future of institutions, the quality of governance, and the kind of societies humanity hopes to build. The future will belong not to institutions that merely accommodate women, but to those that recognize that inclusive leadership is indispensable to sustainable progress in an increasingly complex world.`,
  },

  {
    date: 'July 5, 2026',
    category: 'Mental Health & Development',
    title: 'The Invincible Infrastructure of Human Development',
    excerpt:
      'Beneath every thriving economy lies a form of infrastructure that rarely appears in national budgets or development indicators: the psychological well-being of its people.',
    readTime: '11 min read',
    featured: true,
    image:
      'https://res.cloudinary.com/djxprptlf/image/upload/article3.jpg',
    slug: 'invincible-infrastructure-human-development',
    body: `When nations discuss development, the conversation often revolves around infrastructure, economic growth, technological innovation, industrialization, and governance reforms. Policymakers measure progress through gross domestic product, employment rates, literacy levels, and investment flows. Yet beneath every thriving economy, every successful institution, and every resilient community lies a form of infrastructure that rarely appears in national budgets or development indicators: the psychological well-being of its people.

Among the most overlooked dimensions of this invisible infrastructure is the mental health of women and girls, whose emotional, psychological, and social well-being profoundly influences the stability and prosperity of societies.

Mental health is frequently misunderstood as merely the absence of mental illness. In reality, it encompasses a person's capacity to cope with stress, build healthy relationships, make informed decisions, adapt to change, and contribute productively to society. For women and girls, mental health represents far more than an individual concern; it is a developmental issue, an economic issue, a public health issue, and increasingly, a national security issue.

For girls growing up in the twenty-first century, the landscape of adolescence differs dramatically from that experienced by previous generations. While advances in technology have expanded access to knowledge and opportunities, they have also introduced new forms of psychological vulnerability. Social media platforms expose young girls to continuous streams of carefully curated images, lifestyles, achievements, and beauty standards that often bear little resemblance to reality.

The psychological challenges confronting women often become more complex in adulthood. A professional woman may be expected to excel in her career, support extended family members, contribute financially to household needs, nurture children, maintain social relationships, and participate actively in community life. Each responsibility may appear manageable in isolation. However, when combined, they create a psychological burden that can be both exhausting and invisible.

The future of women's mental health will depend on society's willingness to move beyond awareness campaigns toward systemic transformation. Families must create environments where emotional expression is encouraged rather than discouraged. Educational institutions must incorporate mental health literacy into learning systems. Employers must recognize that psychological well-being is not separate from productivity but fundamental to it.

The mental health of women and girls is therefore not a peripheral concern within the broader development agenda. It is one of its foundations. Economies depend upon it. Families depend upon it. Communities depend upon it. Investing in the mental well-being of women and girls is ultimately an investment in humanity's collective future.`,
  },

  {
    date: 'Apr 29, 2026',
    category: 'Strategic Clarity',
    title: 'Why Most Strategy Documents Are Actually Confusion Documents',
    excerpt:
      'A strategy that requires a glossary to understand is not a strategy. It is a signal that the thinking has not been completed.',
    readTime: '6 min read',
    featured: false,
    image: null,
    slug: 'strategy-documents-confusion',
    body: '',
  },

  {
    date: 'Apr 22, 2026',
    category: 'Organisational Culture',
    title:
      'The Meeting That Should Have Been an Email Was Actually a Power Play',
    excerpt:
      'Time is the currency of authority. How leaders spend it, and how they ask others to spend it, says everything about culture.',
    readTime: '4 min read',
    featured: false,
    image: null,
    slug: 'meeting-power-play',
    body: '',
  },

  {
    date: 'Apr 15, 2026',
    category: 'Executive Coaching',
    title: 'What Coaches Get Wrong About Accountability',
    excerpt:
      'Accountability without clarity is just pressure. And pressure, applied without direction, rarely produces anything useful.',
    readTime: '5 min read',
    featured: false,
    image: null,
    slug: 'coaches-accountability',
    body: '',
  },

  {
    date: 'Apr 8, 2026',
    category: 'Women in Leadership',
    title: 'The Confidence Gap Is Not the Problem. The Clarity Gap Is.',
    excerpt:
      'We have spent years telling women to be more confident. What they actually needed was better tools for strategic thinking.',
    readTime: '7 min read',
    featured: false,
    image: null,
    slug: 'confidence-gap-clarity-gap',
    body: '',
  },

  {
    date: 'Apr 1, 2026',
    category: 'Strategic Clarity',
    title: 'Three Questions That Reveal Whether Your Vision Is Real',
    excerpt:
      'Most organisations have a vision statement. Very few have a vision. The difference shows up in the decisions leaders make under pressure.',
    readTime: '4 min read',
    featured: false,
    image: null,
    slug: 'three-questions-vision',
    body: '',
  },

  {
    date: 'Mar 25, 2026',
    category: 'African Leadership',
    title: 'What African Institutions Can Teach the World About Resilience',
    excerpt:
      'Resilience built under constraint is a different kind of strength. Africa has been developing that muscle for decades.',
    readTime: '8 min read',
    featured: false,
    image: null,
    slug: 'african-institutions-resilience',
    body: '',
  },
];

const CATEGORIES = [
  'All',
  'Strategic Clarity',
  'Leadership & Communication',
  'Organisational Culture',
  'Executive Coaching',
  'Women in Leadership',
  'Women in Business',
  'Mental Health & Development',
  'African Leadership',
];

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? ARTICLES
      : ARTICLES.filter((article) => article.category === activeCategory);

  const featured = ARTICLES.filter((article) => article.featured).slice(0, 3);

  const rest =
    activeCategory === 'All'
      ? ARTICLES.filter((article) => !article.featured)
      : filtered;

  return (
    <main style={{ paddingTop: '6rem' }}>
      {/* HERO */}
      <section
        style={{
          padding: '6rem 10vw 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 30% 50%, #1a120630 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            maxWidth: '1300px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div className="label">Insights</div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 600,
              lineHeight: 1.05,
              maxWidth: '700px',
              marginBottom: '1.5rem',
            }}
          >
            Our Journal.
          </h1>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              lineHeight: 1.9,
              color: 'var(--text-mute)',
              maxWidth: '960px',
              fontWeight: 300,
            }}
          >
            Thinking on leadership, strategy, clarity and the invisible
            architecture of high-performing organisations. Written for leaders
            who take ideas seriously.
          </p>
        </div>
      </section>

      <div className="divider" />

      {/* FEATURED */}
      {activeCategory === 'All' && featured.length > 0 && (
        <section className="section">
          <div className="section-inner">
            <div className="label">Featured</div>

            <div
              className="featured-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr',
                gap: '1px',
                background: 'var(--border)',
                marginBottom: '1px',
              }}
            >
              {/* MAIN FEATURED */}
              <Link
                to={`/insights/${featured[0].slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  background: 'var(--bg-2)',
                  padding: '3rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-2)';
                }}
              >
                <div
                  style={{
                    aspectRatio: '16/9',
                    background: '#1a1206',
                    marginBottom: '1.5rem',
                    overflow: 'hidden',
                  }}
                >
                  {featured[0].image ? (
                    <img
                      src={featured[0].image}
                      alt={featured[0].title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        className="gold"
                        style={{ fontSize: '1.5rem' }}
                      >
                        ◇
                      </span>
                    </div>
                  )}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'var(--accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {featured[0].date} · {featured[0].category}
                </div>

                <h2
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 600,
                    lineHeight: 1.25,
                    marginBottom: '1rem',
                  }}
                >
                  {featured[0].title}
                </h2>

                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '13px',
                    lineHeight: 1.8,
                    color: 'var(--text-mute)',
                    fontWeight: 300,
                    marginBottom: '1.5rem',
                  }}
                >
                  {featured[0].excerpt}
                </p>

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                  }}
                >
                  {featured[0].readTime}
                </div>
              </Link>

              {/* SIDE FEATURED */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1px',
                  background: 'var(--border)',
                }}
              >
                {featured.slice(1).map((article) => (
                  <Link
                    key={article.slug}
                    to={`/insights/${article.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      background: 'var(--bg-2)',
                      padding: '2rem',
                      flex: 1,
                      cursor: 'pointer',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-2)';
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        color: 'var(--accent)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {article.date} · {article.category}
                    </div>

                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 500,
                        lineHeight: 1.3,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {article.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '12px',
                        lineHeight: 1.7,
                        color: 'var(--text-mute)',
                        fontWeight: 300,
                        marginBottom: '0.75rem',
                      }}
                    >
                      {article.excerpt}
                    </p>

                    <div
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: '10px',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {article.readTime}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="divider" />

      {/* ALL ARTICLES */}
      <section className="section">
        <div className="section-inner">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div className="label" style={{ marginBottom: 0 }}>
              All Stories
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  fontFamily: 'var(--sans)',
                  fontSize: '9px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background:
                    activeCategory === category
                      ? 'var(--gold)'
                      : 'transparent',
                  color:
                    activeCategory === category
                      ? 'var(--bg)'
                      : 'var(--text-mute)',
                  border: '1px solid',
                  borderColor:
                    activeCategory === category
                      ? 'var(--gold)'
                      : '#ffffff0f',
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ARTICLES GRID */}
          <div
            className="articles-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1px',
              background: 'var(--border)',
            }}
          >
            {rest.map((article) => (
              <Link
                key={article.slug}
                to={`/insights/${article.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  background: 'var(--bg-2)',
                  padding: '2.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-2)';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: 'var(--accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {article.date}
                </div>

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '9px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-mute)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {article.category}
                </div>

                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    marginBottom: '0.75rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {article.title}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '12px',
                    lineHeight: 1.7,
                    color: 'var(--text-mute)',
                    fontWeight: 300,
                    marginBottom: '1rem',
                  }}
                >
                  {article.excerpt}
                </p>

                <div
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                  }}
                >
                  {article.readTime}
                </div>
              </Link>
            ))}
          </div>

          {/* EMPTY STATE */}
          {rest.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--text-mute)',
                fontFamily: 'var(--sans)',
                fontSize: '13px',
              }}
            >
              No stories found in this category yet.
            </div>
          )}

          {/* LOAD MORE */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '4rem',
            }}
          >
            <button className="btn btn-outline">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section
        style={{
          padding: '6rem 10vw',
          background: 'var(--bg-2)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <div
            className="label"
            style={{ justifyContent: 'center' }}
          >
            Stay Sharp
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 600,
              marginBottom: '1rem',
            }}
          >
            Get the Journal delivered.
          </h2>

          <p
            style={{
              fontFamily: 'var(--sans)',
              fontSize: '13px',
              lineHeight: 1.9,
              color: 'var(--text-mute)',
              fontWeight: 300,
              marginBottom: '2.5rem',
            }}
          >
            Quiet dispatches on leadership, strategy and clarity. No noise. No
            filler. Just thinking worth your time.
          </p>

          <div
            className="newsletter-row"
            style={{
              display: 'flex',
              gap: '1rem',
              maxWidth: '420px',
              margin: '0 auto',
            }}
          >
            <input
              className="form-input"
              type="email"
              placeholder="Your email address"
              style={{ flex: 1 }}
            />

            <button
              className="btn btn-gold"
              style={{ flexShrink: 0 }}
            >
              Subscribe →
            </button>
          </div>
        </div>
      </section>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 900px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
          }

          .articles-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .newsletter-row {
            flex-direction: column !important;
          }
        }

        @media (max-width: 560px) {
          .articles-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}