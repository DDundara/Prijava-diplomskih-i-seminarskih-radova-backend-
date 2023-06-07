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

// const getUsersPerPage = (request, response) => {
  

//     //const page = parseInt(request.params.page)
//     const page = parseInt(request.params.page)
//     // if(page == null){
//     //     page = 0;
//     // }
//     pool.query('SELECT * FROM users ORDER BY id ASC limit 5 offset $1',[(page-1)*5], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).json(results.rows)
//     })
//   }

 
const getUsersPerPage = (request, response) => {
  

  //const page = parseInt(request.params.page)
  const page = parseInt(request.params.page)
  // if(page == null){
  //     page = 0;
  // }
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
  const { name, email, spol, gradid  } = request.body

  pool.query(
    'UPDATE users SET name = $1, email = $2, spol=$3, gradid=$4 WHERE id = $5',
    [name, email, spol, gradid, id],
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

const getKategorije= (request, response) => {
  pool.query('select k.idkat, k.nazivkat from kategorija k', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getStatusi = (request, response) => {
  pool.query('select s.idstatus, s.nazivstatus from statusrada s', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getAllRadovi = (request, response) => {
  // const uname = request.params.username
  // const username = 'markic';
  // //const id = 2
  // console.log("Name nesto: "+uname)

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

const getMentoriByKategorija = (request, response) => {
  const KatId = parseInt(request.params.idkat)
  const UserId = parseInt(request.params.iduser)
  //const id = 2
  console.log("Kat pretraga: "+KatId)
  console.log("User pretraga: "+UserId)

  pool.query('select u.id, u.name,mk.idkat \
  from mentorikategorije mk inner join users u \
  on u.id = mk.idment \
  where mk.idkat = $1 and mk.idment not in \
  (select mr.idment from mentorirad mr inner join pristupnirad pr on mr.idrad = pr.idrad where pr.autorid=$2)', [KatId,UserId], (error, results) => {
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
  // const uname = request.params.username
  // const username = 'markic';
  // //const id = 2
  // console.log("Name nesto: "+uname)

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
      response.status(200).send(`User modified with ID: ${RadId}`)
    }
  )
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
  getRadoviMentor,
  getAllRadovi,
  getMentoriByKategorija,
  getKategorije,
  getStatusi,
  createMentorRad,
  getAllMentoriRad,
  getMentoriSpecifRada,
  updateWorkGrade,
  ProvjeriOcjenuRadaMentora,
  createWork
}