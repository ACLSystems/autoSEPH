export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR

node $WORKDIR/blockdates.js MIC-EXC-03-SEPH-001 5af863b419ebaf0034f48ce1 5afb561ed7ef27001bce8156 5b0b830adee253001bdef64a
node $WORKDIR/blockdates.js MIC-EXC-03-SEPH-002 5af863b419ebaf0034f48ce1 5afb561ed7ef27001bce8156 5b0b830adee253001bdef64a
