class ConvertLegacyScrolledContentElementTypes < ActiveRecord::Migration[5.2]
  def up
    lorem_ipsum1 = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam ' \
                    'nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam ' \
                    'erat, sed diam voluptua. '

    lorem_ipsum2 = 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita ' \
                   'kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ' \
                   'Lorem ipsum dolor sit amet, consetetur sadipscing elitr. Sed diam nonumy ' \
                   'eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam ' \
                   'voluptua. At vero eos et accusam et justo duo dolores et ea rebum. ' \
                   'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum ' \
                   'dolor sit amet. Lorem ipsum dolor sit amet.'

    lorem_ipsum3 = 'Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ' \
                   'ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero ' \
                   'eos et accusam et justo duo dolores et ea rebum. Stet clita kasd  ' \
                   'gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. '\
                   'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse ' \
                   'molestie consequat, vel illum dolore eu feugiat nulla facilisis at ' \
                   'vero eros et accumsan et iusto odio dignissim qui blandit praesent ' \
                   'luptatum zzril delenit augue duis dolore te feugait nulla facilisi.'

    execute(<<-SQL)
      UPDATE pageflow_scrolled_content_elements
      SET type_name = "inlineImage"
      WHERE type_name = "stickyImage";
    SQL

    execute(<<-SQL)
      UPDATE pageflow_scrolled_content_elements
      SET type_name = "textBlock", configuration = '{"children": "#{lorem_ipsum1}", "dummy": true}'
      WHERE type_name = "loremIpsum1";
    SQL

    execute(<<-SQL)
      UPDATE pageflow_scrolled_content_elements
      SET type_name = "textBlock", configuration = '{"children": "#{lorem_ipsum2}", "dummy": true}'
      WHERE type_name = "loremIpsum2";
    SQL

    execute(<<-SQL)
      UPDATE pageflow_scrolled_content_elements
      SET type_name = "textBlock", configuration = '{"children": "#{lorem_ipsum3}", "dummy": true}'
      WHERE type_name = "loremIpsum3";
    SQL
  end
end
