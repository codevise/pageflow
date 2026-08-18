import {Base as BaseDomino} from '../../Base';

export const Base = BaseDomino.extend({
  selector: '.input'
});

Base.findByPropertyName = function(propertyName, {visible, ...options} = {}) {
  return this.findBy(
    el => el.data('inputPropertyName') === propertyName &&
          (!visible || !el.hasClass('hidden_via_binding')),
    {
      predicateName: `${visible ? 'visible ' : ''}input property name '${propertyName}'`,
      ...options
    }
  )
}
