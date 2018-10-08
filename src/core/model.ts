import { Kor } from '.';


export function Model(name: string) {
  return function(constructor: Function) {
    let proto = constructor.prototype;
    proto._dataSourceName = name;
  }
}

export function bindModel(arg: Function) {
  let proto = arg.prototype || arg.constructor.prototype;
  let name  = proto._dataSourceName;
  if (name == null) 
    throw new Error('Bind model called on ${arg.name} that has no _dataSourceName');

  let src = Kor.getConnectionDetails(name);
  if (src == null) 
    throw new Error('Unable to bind model to nonexistent data source');
  
  src.entities != null
    ? src.entities.push(arg)
    : [ arg ];
  console.debug(`Bound new model ${arg.name} to ${name}`);
}
