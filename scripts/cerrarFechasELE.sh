export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR

node $WORKDIR/blockdates.js HIG-101-SEPH-001 5aeb9236ae8215004dfd94e2 5aeb92a732db4e0033dc7109 5b0b7374f8c942001a318a8a
node $WORKDIR/blockdates.js HIG-101-SEPH-002 5aeb9236ae8215004dfd94e2 5aeb92a732db4e0033dc7109 5b0b7374f8c942001a318a8a
