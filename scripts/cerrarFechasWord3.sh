export WORKDIR=/Users/Arturo/aclprojects/autoSEPH
export ALUMNO_TOKEN=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoiYXJ0dXJvY2FzdHJvQGFjbHN5c3RlbXMubXgiLCJleHAiOjE1NjE1MDM1MzM0MjB9.QMnHaVTIp4Bgf0io8yhYhqW4eJZws1z3YD8C2h8Mk2g
cd $WORKDIR

node $WORKDIR/blockdates.js MIC-WRD-03-SEPH-001 5af864353be5490014339264 5afc509e91b4ba001b2efe11 5b0b843cdee253001bdefda1
node $WORKDIR/blockdates.js MIC-WRD-03-SEPH-002 5af864353be5490014339264 5afc509e91b4ba001b2efe11 5b0b843cdee253001bdefda1
