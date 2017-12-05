# Creating Text Embeds

Text embeds allow inserting rich, interactive components into the
content text of pages. They are implemented using React components:

     pageflow.react.registerTextEmbed('greeting', GreetingEmbed);

     function Greeting(props) {
       return (
         <div>Hello {props.name || 'dear reader'}.</div>
       );
     }

Users creating an entry need to use the following special syntax when
editing the text of a page. To display the friendly greeting provided
by the example component above, the following text would have to be
used:

     {greeting}

It is also possible to pass additional parameters:

     {greeting name="John"}

Text embed components can hold state. Note that inside the editor
state is reset whenever the page text is changed since this triggers
re-creation embedded components.
