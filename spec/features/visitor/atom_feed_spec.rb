require 'spec_helper'

feature 'account using a custom domain' do
  let(:account) { create(:account) }

  before do
    account.default_theming.update! cname: 'emma.example.com'
    create(:entry, :published, account: account, title: 'Atom-Powered Robots Run Amok')
  end

  scenario 'sees a feed when requesting the atom feed' do
    visit(pageflow.entries_url(format: 'atom', host: 'emma.example.com'))

    expect(page.driver.response.headers['Content-Type']).to start_with('application/atom+xml') #ignoring charset
    expect(Dom::AtomFeed.title).to eq(account.name)
    expect(Dom::AtomEntry.first.title).to eq('Atom-Powered Robots Run Amok')
  end

  scenario 'sees a feed with multiple pages' do
    create_list(:entry, 3, :published, account: account )

    visit(pageflow.entries_url(page: 2, format: 'atom', host: 'emma.example.com'))

    expect(Dom::AtomEntry.first.title).to eq('Entry 2')
  end

  scenario 'sees a page not found when not using the custom domain' do
    visit(pageflow.entries_url(format: 'atom'))

    expect(page).to have_http_status(:not_found)
  end
end

feature 'account not using a custom domain' do
  let(:account) { create(:account) }

  before do
    create(:entry, :published, account: account, title: 'Atom-Powered Robots Run Amok')
  end

  scenario 'sees a page not found when requesting the atom feed' do
    visit(pageflow.entries_url(format: 'atom'))

    expect(page).to have_http_status(:not_found)
  end
end

__END__

Example of an actual feed built by this:

<?xml version="1.0" encoding="UTF-8"?>
<feed xml:lang="en-US" xmlns="http://www.w3.org/2005/Atom">
  <id>tag:scrollytelling.dev,2005:/entries</id>
  <link rel="alternate" type="text/html" href="http://scrollytelling.dev"/>
  <link rel="self" type="application/atom+xml" href="http://scrollytelling.dev/entries.atom"/>
  <title>Scrollytelling</title>
  <url>http://scrollytelling.dev/</url>
  <updated>2017-10-24T18:08:36+02:00</updated>
  <favicon>/assets/pageflow/themes/scrollytelling/favicon-657ceda3a0083fce11b5b7ea99bc77e24aaafe884eb81e943a34c12f4716a747.ico</favicon>
  <entry>
    <id>tag:scrollytelling.dev,2005:Pageflow::Entry/1219</id>
    <published>2017-10-24T18:05:59+02:00</published>
    <updated>2017-10-24T18:08:36+02:00</updated>
    <link rel="alternate" type="text/html" href="http://scrollytelling.dev/entries/en-nog-een-tekstverhaal"/>
    <url>http://scrollytelling.dev/entries/en-nog-een-tekstverhaal</url>
    <title>En nog een tekstverhaal</title>
    <content type="text" xml:lang="nl">In het donkere woud was het stil. IJzig stil. Een vreemde stilte. Het leek wel alsof de wereld zijn adem inhield. De donkere bomen stonden bewegingloos te wachten op wat er komen ging. Plots werd er geruis gehoord in de verte. Al snel hoorden de bomen het geklapwiek van vleugels. De RAVEN kwamen eraan! De donkere vogels streken neer op de takken van de bomen. Rustig streken zij hun vleugels. Weer hoorden de bomen een vreemd geluid. Het geluid zwol aan tot een zwaar getrippel. RATTEN! Honderden RATTEN kropen onder de bomen. De RAVEN keken met verbazing naar beneden.” Wat doen jullie hier?” Krasten de oudste RAVEN naar de RATTEN? “Er hangt een vreemde sfeer in de lucht” riepen de RATTEN naar boven. “Wij zijn verdreven van onze woonplaats, omdat er geen eten meer is!” “Oh,” krasten de RAVEN, “dat is ons ook overkomen. Al het voer is verdwenen!” De RAVEN fladderden met hun vleugels. “Waar willen jullie naar toe? “ vroegen de RAVEN. “Wij willen naar de stad”, antwoordden de RATTEN. “Dat kan niet”, vonden de RAVEN, “ wij waren hier het eerst en wij vliegen heel snel. Wij durven te wedden dat wij als eerste in de stad zijn”.</content>
    <image>pageflow/placeholder_original.jpg</image>
    <author>
      <name>Scrollytelling</name>
    </author>
  </entry>
</feed>
