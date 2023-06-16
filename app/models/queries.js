const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: '123',
  port: 5432,
})

const getUsers = (request, response) => {
  if(request.query.title!=null && request.query.title!=""){
    const title = request.query.title;
    console.log("Title pun: "+title)
     console.log("Title pun2: "+title)
    pool.query('SELECT * FROM users WHERE "name" like $1', ['%'+title+'%'], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })

  }
  else
  {
    console.log("Title prazan: ")
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
      console.log("Results len: "+results.rows.length)
    })
  }
  
}

const getUsersPerPage = (request, response) => {
  

  const page = parseInt(request.params.page)

  pool.query('select u.id,u.name,u.email,u.spol,u.gradid, g.naziv as "gradnaziv", \
  u.username,u.password,u.registered,u.last_login,u.groupid,ug.naziv as "grupanaziv" \
  from users u inner join usersgroups ug on u.groupid = ug.idgroup inner join gradovi g \
  on u.gradid=g.id ORDER BY u.id ASC limit 5 offset $1',[(page-1)*5], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
} 

const getUsersAndCities = (request, response) => {
    pool.query('select u.id,u.name,u.email,u.spol,g.naziv from users u inner join gradovi g on u.gradid=g.id', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }


  const getCities = (request, response) => {
    pool.query('select g.id, g.naziv from gradovi g', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createNoviGrad = (request, response) => {
    const { novigrad } = request.body
    console.log("Novi grad naziv: "+novigrad)
    pool.query('INSERT INTO gradovi (naziv) \
    VALUES ($1) returning id', [novigrad], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`${results.rows[0].id}`)
    })
  }

  const getTotal = (request, response) => {
    pool.query('select count(*) "total", ceiling(count(*)/5::float) "numOfpages" from users', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }




const getUserById = (request, response) => {
  const id = parseInt(request.params.id)
  //const id = 2
  console.log("ID: "+id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserByName = (request, response) => {
  const name = parseInt(request.params.name)
  //const id = 2
  console.log("Name: "+name)

  pool.query('SELECT * FROM users WHERE name like %$1%', [name], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, email, spol, gradid } = request.body

  pool.query('INSERT INTO users (name, email,spol,gradid) VALUES ($1,$2,$3,$4)', [name, email,spol,gradid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  console.log("IDupd: "+id)
  const { name, email, spol, gradid,groupid  } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, spol=$3, gradid=$4, groupid=$5 WHERE id = $6',
    [name, email, spol, gradid, groupid,id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}
//kategorije 

const createKategorija = (request, response) => {
  const { nazivkat, moderatorid} = request.body

  pool.query('INSERT INTO kategorija (nazivkat, moderatorid) VALUES ($1,$2) returning idkat', [nazivkat, moderatorid], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Kategorija added with ID: ${results.rows[0].idkat}`)
//ubacujem odmah mentora i kategoriju za mentorstvo
console.log("IDkat za mentorstvo: "+results.rows[0].idkat)
    pool.query('INSERT INTO mentorikategorije (idkat, idment) VALUES ($1,$2)', [results.rows[0].idkat, moderatorid], (error, results) => {
      if (error) {
        throw error
      }
    })

  })


}

const createKategorijaMentor = (request, response) => {
  const { idkat, idment} = request.body
  console.log("IDkatinsert: "+idkat)
  console.log("IDmentinsert: "+idment)

  pool.query('INSERT INTO mentorikategorije (idkat, idment) VALUES ($1,$2)', [idkat, idment], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Kategorija added with ID: ${results.insertId}`)
  })
}

const getKategorije= (request, response) => {
  pool.query('select k.idkat, k.nazivkat from kategorija k', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getKategorijeSve= (request, response) => {
  pool.query('select kt.idkat,kt.nazivkat, u.name as moderator  from kategorija kt inner join users u \
  on kt.moderatorid = u.id', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getKategorijaById = (request, response) => {
  const KatId = parseInt(request.params.idkat)
  //const id = 2
  console.log("IDkat for edit: "+KatId)

  pool.query('SELECT * FROM kategorija WHERE idkat = $1', [KatId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRadoviTotal = (request, response) => {
  pool.query('select count(*) "total", ceiling(count(*)/5::float) "numOfpages" from pristupnirad', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateKategorija = (request, response) => {
  const idkat = parseInt(request.params.idkat)
  console.log("IDupdkat: "+idkat)
  const { nazivkat, moderatorid } = request.body

  pool.query(
    'UPDATE kategorija SET nazivkat = $1, moderatorid = $2 WHERE idkat = $3',
    [nazivkat, moderatorid, idkat],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${idkat}`)
    }
  )
}

const getKategorijeMentori = (request, response) => {
  const KatId = parseInt(request.params.idkat)

  console.log("Kat pretraga: "+KatId)

  pool.query('select mk.idkatment, kt.idkat,kt.nazivkat, u.name as mentor from kategorija kt \
  inner join mentorikategorije mk ON mk.idkat = kt.idkat \
  inner join users u on mk.idment = u.id where kt.idkat =$1', [KatId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getKategorijeMentoriAllJoin = (request, response) => {

  pool.query('select kt.idkat,kt.nazivkat, u.name as mentor from kategorija kt \
  inner join mentorikategorije mk ON mk.idkat = kt.idkat \
  inner join users u on mk.idment = u.id', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



const getAllMentori= (request, response) => {
  pool.query('select u.id, u.name from users u where u.groupid = 2', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAllMentoriForAdd= (request, response) => {
  const KatId = parseInt(request.params.idkat)
  console.log("Kat adding: "+KatId)
  pool.query('select u.id, u.name from users u where u.groupid = 2 and u.id not in \
  (select kt.moderatorid from kategorija kt where kt.idkat = $1) \
  and u.id not in (select mk.idment from mentorikategorije mk where mk.idkat = $1)',[KatId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const removeMentorFromCategory = (request, response) => {
  const IdZapis = parseInt(request.params.idzapis)
  console.log("Zapis brisanja: "+IdZapis)
  pool.query('DELETE FROM mentorikategorije WHERE idkatment = $1', [IdZapis], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${IdZapis}`)
  })
}

const getStatusi = (request, response) => {
  pool.query('select s.idstatus, s.nazivstatus from statusrada s where s.idstatus <> 1', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAllRadovi = (request, response) => {

  pool.query('select * from pristupnirad', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getMojiRadovi = (request, response) => {
  const uname = request.params.username
  const username = 'markic';
  //const id = 2
  console.log("Name nesto: "+uname)

  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada",sr.nazivStatus as "StatusRada",\
  u.name as "AutorRada", pr.ocjena as "Ocjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join users u on pr.autorId = u.id \
  where u.username = $1',[uname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRadoviAdmin = (request, response) => {
  const page = parseInt(request.params.page)
  console.log("pagge list rad: "+page)
  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada",\
  sr.nazivStatus as "StatusRada",\
  au.name as "AutorRada", pr.ocjena as "Ocjena"\
  from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join users au on pr.autorid = au.id order by pr.idrad ASC limit 5 offset $1',[(page-1)*5],(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRadoviAdminPretraga = (request, response) => {

  const datumod = request.query.datumod;
  const datumdo = request.query.datumdo;

  console.log("Datum od1: "+datumod)
  console.log("Datum do1: "+datumdo)


if(request.query.datumod!=null && request.query.datumod!="" && request.query.datumdo!=null && request.query.datumdo!=""){

  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada", \
  sr.nazivStatus as "StatusRada", \
  au.name as "AutorRada",  pr.ocjena as "FinalOcjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join users au on pr.autorid = au.id \
  where pr.datumdospijeca between $1 and $2',[datumod,datumdo], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
else
{
  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada", \
  sr.nazivStatus as "StatusRada", \
  au.name as "AutorRada",  pr.ocjena as "FinalOcjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join users au on pr.autorid = au.id', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
}

const getRadoviMentor = (request, response) => {
  const uname = request.params.username
  const username = 'markic';
  //const id = 2
  console.log("Name nesto: "+uname)

  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada", \
  case when (select count(*) from kategorija ktm where ktm.moderatorid=u.id and ktm.idkat = kt.idkat) > 0 then 1 else 0 \
  end "MentorKat", \
  sr.nazivStatus as "StatusRada", \
  u.name as "MentorRada", au.name as "AutorRada",  pr.ocjena as "FinalOcjena", mr.ocjena as "RadOcjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join mentorirad mr on mr.idrad = pr.idrad \
  inner join users u on mr.idment = u.id \
  inner join users au on pr.autorid = au.id \
  where u.username = $1',[uname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRadoviMentorPretraga = (request, response) => {
  const uname = request.params.username
  const datumod = request.query.datumod;
  const datumdo = request.query.datumdo;
  console.log("User pretraga: "+uname)
  console.log("Datum od: "+datumod)
  console.log("Datum do: "+datumdo)


if(request.query.datumod!=null && request.query.datumod!="" && request.query.datumdo!=null && request.query.datumdo!=""){

  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada", \
  case when (select count(*) from kategorija ktm where ktm.moderatorid=u.id and ktm.idkat = kt.idkat) > 0 then 1 else 0 \
  end "MentorKat", \
  sr.nazivStatus as "StatusRada", \
  u.name as "MentorRada", au.name as "AutorRada",  pr.ocjena as "FinalOcjena", mr.ocjena as "RadOcjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join mentorirad mr on mr.idrad = pr.idrad \
  inner join users u on mr.idment = u.id \
  inner join users au on pr.autorid = au.id \
  where u.username = $1 and pr.datumdospijeca between $2 and $3',[uname,datumod,datumdo], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
else
{
  pool.query('select pr.idrad,pr.nazivrad,pr.opis, \
  pr.datumdospijeca,vr.nazivvrsta as "VrstaRada", \
  kt.idkat, kt.nazivKat as "KategorijaRada", \
  case when (select count(*) from kategorija ktm where ktm.moderatorid=u.id and ktm.idkat = kt.idkat) > 0 then 1 else 0 \
  end "MentorKat", \
  sr.nazivStatus as "StatusRada", \
  u.name as "MentorRada", au.name as "AutorRada",  pr.ocjena as "FinalOcjena", mr.ocjena as "RadOcjena" from pristupnirad pr \
  inner join vrstarada vr on pr.vrstaRadaId = vr.idVrsta \
  inner join kategorija kt ON kt.idKat = pr.kategorijaId \
  inner join statusrada sr on pr.statusId = sr.idStatus \
  inner join mentorirad mr on mr.idrad = pr.idrad \
  inner join users u on mr.idment = u.id \
  inner join users au on pr.autorid = au.id \
  where u.username = $1',[uname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}
}

const getMentoriByKategorija = (request, response) => {
  const KatId = parseInt(request.params.idkat)
  const UserId = parseInt(request.params.iduser)
  //const id = 2
  console.log("Kat pretraga: "+KatId)
  console.log("User pretraga: "+UserId)

  pool.query('select u.id, u.name,mk.idkat \
  from mentorikategorije mk inner join users u \
  on u.id = mk.idment \
  where mk.idkat = $1 and u.id not in \
  (select mr.idment from mentorirad mr inner join pristupnirad pr on mr.idrad = pr.idrad where pr.autorid=$2 and pr.kategorijaid=$1)', [KatId,UserId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const ProsjekOcjenaPoKategoriji = (request, response) => {

  pool.query('select kt.idkat,kt.nazivkat,round(avg(pr.ocjena),2) as prosjek \
  from kategorija kt inner join pristupnirad pr \
  on kt.idkat = pr.kategorijaid group by kt.idkat', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createWork = (request, response) => {
  const { nazivrada, opis, datumd, vrstarada,kategorijarada,statusid,autorid } = request.body

  pool.query('INSERT INTO pristupnirad (nazivrad, opis,kategorijaid,vrstaradaid,statusid,autorid,datumdospijeca) \
  VALUES ($1,$2,$3,$4,$5,$6,$7)', [nazivrada, opis,kategorijarada,vrstarada,statusid,autorid,datumd], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Work added with ID: ${results.insertId}`)
  })
}

const createMentorRad = (request, response) => {
  const { RadId, MentorId} = request.body
  console.log("Rad unos: "+RadId)
  console.log("Mentor unos: "+MentorId)
  pool.query('INSERT INTO mentorirad (idrad,idment) \
  VALUES ($1,$2)', [RadId, MentorId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Mentor added with ID: ${results.insertId}`)
  })
}

const getAllMentoriRad = (request, response) => {

  pool.query('select * from mentorirad', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getMentoriSpecifRada = (request, response) => {
  const RadId = parseInt(request.params.idrad)
  //const id = 2
  console.log("Rad pretraga: "+RadId)

  pool.query('select mr.idment, u.name, mr.ocjena from mentorirad mr  \
  inner join pristupnirad pr on mr.idrad = pr.idrad \
  inner join users u on mr.idment = u.id \
  where pr.idrad = $1', [RadId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const ProvjeriOcjenuRadaMentora = (request, response) => {
  const RadId = parseInt(request.params.idrad)
  const MentorId = parseInt(request.params.idment)
  //const id = 2
  console.log("Rad provjera ocjene: "+RadId)
  console.log("Mentor provjera ocjene: "+MentorId)

  pool.query('select * from mentorirad where idrad=$1 and idment=$2 and ocjena is not null', [RadId,MentorId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const updateWorkGrade = (request, response) => {
  
  
  const { RadId, MentorId, Ocjena} = request.body
  console.log("Upd rad: "+RadId)
  console.log("Upd mentor: "+MentorId)
  console.log("Upd ocjena: "+Ocjena)

  pool.query(
    'UPDATE mentorirad SET ocjena = $1 where idrad = $2 and idment = $3',
    [Ocjena,RadId, MentorId],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Work modified with ID: ${RadId}`)
    }
  )
}

const updateWorkStatus = (request, response) => {
  
  
  const { RadId, StatusId} = request.body
  console.log("Upd rad1: "+RadId)
  console.log("Upd stat1: "+StatusId)

  pool.query(
    'UPDATE pristupnirad SET statusid = $1 where idrad = $2',
    [StatusId,RadId],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Work modified with ID: ${RadId}`)
    }
  )
}

const updateWorkAcceptance = (request, response) => {
  
  const { RadId,Ocjena} = request.body
  console.log("Upd rad1: "+RadId)
  console.log("Upd ocjena1: "+Ocjena)

  pool.query(
    'UPDATE pristupnirad SET ocjena = $1, statusid=3 where idrad = $2',
    [Ocjena,RadId],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Work modified with ID: ${RadId}`)
    }
  )
}

const IsWorkAccepted = (request, response) => {
  const RadId = parseInt(request.params.idrad)

  console.log("Rad provjera ocjene potvrda: "+RadId)

  pool.query('select ocjena from pristupnirad where idrad=$1', [RadId], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const deleteWork = (request, response) => {
  const idrad = parseInt(request.query.idrad)
  console.log("Rad delete: "+idrad)

  pool.query('DELETE FROM pristupnirad WHERE idrad = $1', [idrad], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`Work deleted with ID: ${idrad}`)
  })
}

module.exports = {
  getUsers,
  getUsersPerPage,
  getUsersAndCities,
  getCities,
  getTotal,
  getUserById,
  getUserByName,
  createUser,
  updateUser,
  deleteUser,
  getMojiRadovi,
  getRadoviAdmin,
  getRadoviAdminPretraga,
  getRadoviMentor,
  getRadoviMentorPretraga,
  getAllRadovi,
  getRadoviTotal,
  getMentoriByKategorija,
  ProsjekOcjenaPoKategoriji,
  createKategorija,
  createNoviGrad,
  createKategorijaMentor,
  getKategorije,
  getKategorijeSve,
  getKategorijaById,
  updateKategorija,
  getKategorijeMentori,
  getKategorijeMentoriAllJoin,
  getAllMentori,
  getAllMentoriForAdd,
  removeMentorFromCategory,
  getStatusi,
  createMentorRad,
  getAllMentoriRad,
  getMentoriSpecifRada,
  updateWorkGrade,
  updateWorkStatus,
  updateWorkAcceptance,
  ProvjeriOcjenuRadaMentora,
  IsWorkAccepted,
  createWork,
  deleteWork
}